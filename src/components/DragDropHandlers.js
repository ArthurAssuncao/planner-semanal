export const handleDragStart =
  (
    setIsDragging,
    setDraggedActivity,
    setDraggedFromSchedule,
    schedule,
    setSchedule,
    timeSlots
  ) =>
  (e, activity, fromSchedule = false, scheduleKey = null) => {
    if (fromSchedule) {
      setDraggedFromSchedule(scheduleKey);
      setDraggedActivity(activity);

      // Remove temporariamente a atividade da tabela
      const time = scheduleKey.split("-").pop();
      const day = scheduleKey.replace(`-${time}`, "");
      const timeIndex = timeSlots.findIndex((slot) => slot.time === time);
      const newSchedule = { ...schedule };

      for (let i = 0; i < activity.duration; i++) {
        const currentIndex = timeIndex + i;
        if (currentIndex >= 0 && currentIndex < timeSlots.length) {
          const currentTime = timeSlots[currentIndex].time;
          const keyToRemove = `${day}-${currentTime}`;
          if (newSchedule[keyToRemove]?.id === activity.id) {
            delete newSchedule[keyToRemove];
          }
        }
      }

      setSchedule(newSchedule);
    } else {
      setDraggedActivity(activity);
      setDraggedFromSchedule(null);
    }
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

export const handleDragEnd =
  (
    setIsDragging,
    setDraggedActivity,
    setDraggedFromSchedule,
    schedule,
    setSchedule,
    timeSlots,
    draggedActivity,
    draggedFromSchedule
  ) =>
  (e, fromSchedule = false, scheduleKey = null) => {
    if (
      fromSchedule &&
      draggedFromSchedule &&
      e.dataTransfer.dropEffect !== "move"
    ) {
      // Restaura a atividade apenas se o drop não foi bem-sucedido
      const time = draggedFromSchedule.split("-").pop();
      const day = draggedFromSchedule.replace(`-${time}`, "");
      const activity = draggedActivity;
      const timeIndex = timeSlots.findIndex((slot) => slot.time === time);
      const newSchedule = { ...schedule };

      for (let i = 0; i < activity.duration; i++) {
        const currentIndex = timeIndex + i;
        if (currentIndex >= 0 && currentIndex < timeSlots.length) {
          const currentTime = timeSlots[currentIndex].time;
          const keyToRestore = `${day}-${currentTime}`;
          newSchedule[keyToRestore] = {
            ...activity,
            isFirst: i === 0,
          };
        }
      }

      setSchedule(newSchedule);
    }

    setDraggedActivity(null);
    setDraggedFromSchedule(null);
    setIsDragging(false);
  };

export const handleDragOver = (e) => {
  // console.log("Drag Over");
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
};

export const handleDrop =
  (
    setIsDragging,
    draggedActivity,
    draggedFromSchedule,
    timeSlots,
    schedule,
    setSchedule
  ) =>
  (e, day, time) => {
    e.preventDefault();
    if (!draggedActivity) return;

    const scheduleKey = `${day}-${time}`;
    const newSchedule = { ...schedule };
    let dropSuccess = false;

    if (draggedFromSchedule) {
      const timeIndex = timeSlots.findIndex((slot) => slot.time === time);
      let canPlace = true;

      // Verifica se pode colocar a atividade no novo local
      for (let i = 0; i < draggedActivity.duration; i++) {
        if (timeIndex + i >= timeSlots.length) {
          canPlace = false;
          break;
        }
        const checkKey = `${day}-${timeSlots[timeIndex + i].time}`;
        if (newSchedule[checkKey]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        // Coloca a atividade arrastada no novo local
        for (let i = 0; i < draggedActivity.duration; i++) {
          const slotKey = `${day}-${timeSlots[timeIndex + i].time}`;
          newSchedule[slotKey] = { ...draggedActivity, isFirst: i === 0 };
        }
        setSchedule(newSchedule);
        dropSuccess = true;
      }
    } else {
      // Nova atividade da lista
      const timeIndex = timeSlots.findIndex((slot) => slot.time === time);
      if (!newSchedule[scheduleKey]) {
        newSchedule[scheduleKey] = {
          ...draggedActivity,
          duration: 1,
          isFirst: true,
        };
        setSchedule(newSchedule);
        dropSuccess = true;
      }
    }

    // Atualiza o dataTransfer para indicar se o drop foi bem-sucedido
    e.dataTransfer.dropEffect = dropSuccess ? "move" : "none";
    setIsDragging(false);
  };

export const removeActivity = (
  scheduleKey,
  schedule,
  setSchedule,
  timeSlots
) => {
  const time = scheduleKey.split("-").pop();
  const day = scheduleKey.replace(`-${time}`, "");
  const activity = schedule[scheduleKey];

  if (!activity || !activity.isFirst) return;

  const newSchedule = { ...schedule };

  const timeIndex = timeSlots.findIndex((slot) => slot.time === time);

  if (timeIndex === -1) return;

  // Remove todos os slots ocupados pela atividade
  for (let i = 0; i < activity.duration; i++) {
    const currentIndex = timeIndex + i;

    // Verifica se o índice está dentro dos limites do array
    if (currentIndex >= 0 && currentIndex < timeSlots.length) {
      const currentTime = timeSlots[currentIndex].time;
      const keyToRemove = `${day}-${currentTime}`;

      // Verifica se a atividade no slot é parte da atividade que está sendo removida
      if (newSchedule[keyToRemove]?.id === activity.id) {
        delete newSchedule[keyToRemove];
      }
    }
  }

  setSchedule(newSchedule);
};

export const adjustActivityDuration = (
  scheduleKey,
  timeSlots,
  schedule,
  setSchedule,
  increase
) => {
  const activity = schedule[scheduleKey];
  if (!activity || !activity.isFirst) return;

  const time = scheduleKey.split("-").pop();
  const day = scheduleKey.replace(`-${time}`, "");
  const newSchedule = { ...schedule };
  const timeIndex = timeSlots.findIndex((slot) => slot.time === time);
  const currentDuration = activity.duration;
  const newDuration = increase
    ? currentDuration + 1
    : Math.max(1, currentDuration - 1);

  if (increase) {
    // Verifica se o próximo slot existe e está vazio
    if (timeIndex + currentDuration < timeSlots.length) {
      const nextSlotKey = `${day}-${
        timeSlots[timeIndex + currentDuration].time
      }`;
      if (!newSchedule[nextSlotKey]) {
        // Adiciona o novo slot
        newSchedule[nextSlotKey] = {
          ...activity,
          isFirst: false,
          duration: newDuration,
        };
        // Atualiza a duração no slot principal
        newSchedule[scheduleKey] = { ...activity, duration: newDuration };
        setSchedule(newSchedule);
      }
    }
  } else if (newDuration >= 1) {
    // Remove o último slot
    const lastSlotKey = `${day}-${
      timeSlots[timeIndex + currentDuration - 1].time
    }`;
    delete newSchedule[lastSlotKey];

    // Atualiza a duração no slot principal
    newSchedule[scheduleKey] = { ...activity, duration: newDuration };
    setSchedule(newSchedule);
  }
};
