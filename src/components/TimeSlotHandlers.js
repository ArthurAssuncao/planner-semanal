export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const period = hour < 12 ? "Manhã" : hour < 18 ? "Tarde" : "Noite";
      slots.push({ time: timeString, period });
    }
  }
  return slots;
};

export const getTurn = (time) => {
  const hour = parseInt(time.split(":")[0]);
  if (hour < 12) return "Manhã";
  if (hour < 18) return "Tarde";
  return "Noite";
};

export const addTimeSlot = (timeSlots, setTimeSlots) => {
  const newTime = prompt("Digite o horário (HH:MM):");
  if (newTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
    const period = getTurn(newTime);
    const newSlot = { time: newTime, period };
    setTimeSlots(
      [...timeSlots, newSlot].sort((a, b) => a.time.localeCompare(b.time))
    );
  } else if (newTime) {
    alert("Formato de horário inválido. Use HH:MM");
  }
};

export const removeTimeSlot = (
  timeToRemove,
  timeSlots,
  setTimeSlots,
  schedule,
  setSchedule
) => {
  setTimeSlots(timeSlots.filter((slot) => slot.time !== timeToRemove));
  const newSchedule = { ...schedule };
  Object.keys(newSchedule).forEach((key) => {
    if (key.includes(timeToRemove)) {
      delete newSchedule[key];
    }
  });
  setSchedule(newSchedule);
};
