import { useEffect, useState } from "react";
import { ActivitiesPanel } from "./ActivitiesPanel";
import { ControlsPanel } from "./ControlsPanel";
import {
  adjustActivityDuration,
  handleDragEnd,
  handleDragOver,
  handleDragStart,
  handleDrop,
  removeActivity,
} from "./DragDropHandlers";
import { FullTableView } from "./FullTableView";
import { SingleDayView } from "./SingleDayView";
import {
  addTimeSlot,
  generateTimeSlots,
  removeTimeSlot,
} from "./TimeSlotHandlers";
import { days, daysShort } from "./constants";
import { printStyles } from "./styles";
import { useScheduleStorage } from "./useScheduleStorage";

const ScheduleTableSystem = () => {
  const [activitiesCollapsed, setActivitiesCollapsed] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(1);
  const [viewMode, setViewMode] = useState("tabs");
  const [draggedActivity, setDraggedActivity] = useState(null);
  const [draggedFromSchedule, setDraggedFromSchedule] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Função para adicionar atividade
  const addActivity = () => {
    const name = prompt("Nome da atividade:");
    if (!name) return;

    const color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    const newActivity = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      color,
    };

    setActivities([...activities, newActivity]);
  };

  // Função para remover atividade
  const removeActivityFromList = (activityId) => {
    if (
      !window.confirm(
        "Tem certeza? Isso removerá todas as instâncias dessa atividade na tabela."
      )
    )
      return;

    // Remove da lista de atividades
    setActivities(activities.filter((a) => a.id !== activityId));

    // Remove da tabela de horários
    const newSchedule = { ...schedule };
    Object.keys(newSchedule).forEach((key) => {
      if (newSchedule[key].id === activityId) {
        delete newSchedule[key];
      }
    });
    setSchedule(newSchedule);
  };

  const handleRemoveActivity = (day, time) => {
    const scheduleKey = `${day}-${time}`;
    removeActivity(scheduleKey, schedule, setSchedule, timeSlots);
  };

  const { loadFromStorage, saveToStorage } = useScheduleStorage();

  const [timeSlots, setTimeSlots] = useState(() => {
    const saved = loadFromStorage();
    return saved?.timeSlots || generateTimeSlots();
  });

  const [schedule, setSchedule] = useState(() => {
    const saved = loadFromStorage();
    return saved?.schedule || {};
  });

  const [activities, setActivities] = useState(() => {
    const saved = loadFromStorage();
    return (
      saved?.activities || [
        { id: "math", name: "Matemática", color: "#3B82F6" },
        // ... outras atividades padrão
      ]
    );
  });

  const resetTable = () => {
    if (
      window.confirm(
        "Tem certeza que deseja resetar toda a tabela? Esta ação não pode ser desfeita."
      )
    ) {
      setTimeSlots(generateTimeSlots());
      setSchedule({});
      setActivities([
        { id: "math", name: "Matemática", color: "#3B82F6" },
        // ... outras atividades padrão
      ]);
      localStorage.removeItem("scheduleTableData");
    }
  };

  const handleExport = () => {
    const dataToExport = {
      version: 1,
      exportedAt: new Date().toISOString(),
      timeSlots,
      schedule,
      activities,
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `horarios-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        // Validação básica do arquivo
        if (!data.timeSlots || !data.schedule || !data.activities) {
          throw new Error("Formato de arquivo inválido");
        }

        if (
          window.confirm(
            "Importar estes dados? Isso substituirá seus dados atuais."
          )
        ) {
          setTimeSlots(data.timeSlots);
          setSchedule(data.schedule);
          setActivities(data.activities);
          alert("Dados importados com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao importar:", error);
        alert("Erro ao importar arquivo. Verifique se o arquivo é válido.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Permite reimportar o mesmo arquivo
  };

  const handlePrint = () => {
    window.print();
  };

  const updateActivity = (updatedActivity) => {
    // Atualiza a lista de atividades
    setActivities(
      activities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      )
    );

    // Atualiza todas as instâncias na tabela de horários
    const newSchedule = { ...schedule };
    Object.keys(newSchedule).forEach((key) => {
      if (newSchedule[key].id === updatedActivity.id) {
        newSchedule[key] = {
          ...newSchedule[key],
          name: updatedActivity.name,
          color: updatedActivity.color,
        };
      }
    });
    setSchedule(newSchedule);
  };

  useEffect(() => {
    saveToStorage({ timeSlots, schedule, activities });
  }, [timeSlots, schedule, activities, saveToStorage]);

  return (
    <>
      <style jsx>{printStyles}</style>

      <div className="p-3 sm:p-6 max-w-full mx-auto bg-gray-50 min-h-screen">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 print:text-center print:text-lg">
            Sistema de Horários
          </h1>

          <ActivitiesPanel
            activities={activities}
            activitiesCollapsed={activitiesCollapsed}
            setActivitiesCollapsed={setActivitiesCollapsed}
            addActivity={addActivity}
            removeActivityFromList={removeActivityFromList}
            handleDragStart={handleDragStart(
              setIsDragging,
              setDraggedActivity,
              setDraggedFromSchedule
            )}
            handleDragEnd={handleDragEnd(
              setIsDragging,
              setDraggedActivity,
              setDraggedFromSchedule
            )}
            updateActivity={updateActivity}
          />

          <ControlsPanel
            addTimeSlot={() => addTimeSlot(timeSlots, setTimeSlots)}
            resetTable={resetTable}
            handlePrint={handlePrint}
            handleExport={handleExport}
            handleImport={handleImport}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        <div className="block sm:hidden print-area">
          {viewMode === "tabs" ? (
            <SingleDayView
              currentDayIndex={currentDayIndex}
              setCurrentDayIndex={setCurrentDayIndex}
              days={days}
              daysShort={daysShort}
              timeSlots={timeSlots}
              schedule={schedule}
              removeTimeSlot={(time) =>
                removeTimeSlot(
                  time,
                  timeSlots,
                  setTimeSlots,
                  schedule,
                  setSchedule
                )
              }
              handleDragOver={handleDragOver}
              adjustActivityDuration={(day, time, increase) => {
                const scheduleKey = `${day}-${time}`;
                adjustActivityDuration(
                  scheduleKey,
                  timeSlots,
                  schedule,
                  setSchedule,
                  increase
                );
              }}
              removeActivity={(day, time) => {
                const scheduleKey = `${day}-${time}`;
                removeActivity(scheduleKey, schedule, setSchedule, timeSlots);
              }}
              handleDragStart={(e, activity, fromSchedule, scheduleKey) =>
                handleDragStart(
                  setIsDragging,
                  setDraggedActivity,
                  setDraggedFromSchedule,
                  schedule,
                  setSchedule,
                  timeSlots
                )(e, activity, fromSchedule, scheduleKey)
              }
              handleDragEnd={(e, fromSchedule, scheduleKey) =>
                handleDragEnd(
                  setIsDragging,
                  setDraggedActivity,
                  setDraggedFromSchedule,
                  schedule,
                  setSchedule,
                  timeSlots,
                  draggedActivity,
                  draggedFromSchedule
                )(e, fromSchedule, scheduleKey)
              }
              handleDrop={(e, day, time) =>
                handleDrop(
                  setIsDragging,
                  draggedActivity,
                  draggedFromSchedule,
                  timeSlots,
                  schedule,
                  setSchedule
                )(e, day, time)
              }
            />
          ) : (
            <FullTableView
              days={days}
              daysShort={daysShort}
              timeSlots={timeSlots}
              schedule={schedule}
              removeTimeSlot={(time) =>
                removeTimeSlot(
                  time,
                  timeSlots,
                  setTimeSlots,
                  schedule,
                  setSchedule
                )
              }
              handleDragOver={handleDragOver}
              adjustActivityDuration={(day, time, increase) => {
                const scheduleKey = `${day}-${time}`;
                adjustActivityDuration(
                  scheduleKey,
                  timeSlots,
                  schedule,
                  setSchedule,
                  increase
                );
              }}
              removeActivity={handleRemoveActivity}
              handleDragStart={(e, activity, fromSchedule, scheduleKey) =>
                handleDragStart(
                  setIsDragging,
                  setDraggedActivity,
                  setDraggedFromSchedule,
                  schedule,
                  setSchedule,
                  timeSlots
                )(e, activity, fromSchedule, scheduleKey)
              }
              handleDragEnd={(e, fromSchedule, scheduleKey) =>
                handleDragEnd(
                  setIsDragging,
                  setDraggedActivity,
                  setDraggedFromSchedule,
                  schedule,
                  setSchedule,
                  timeSlots,
                  draggedActivity,
                  draggedFromSchedule
                )(e, fromSchedule, scheduleKey)
              }
              handleDrop={(e, day, time) =>
                handleDrop(
                  setIsDragging,
                  draggedActivity,
                  draggedFromSchedule,
                  timeSlots,
                  schedule,
                  setSchedule
                )(e, day, time)
              }
              isDragging={!!isDragging}
            />
          )}
        </div>

        <div className="hidden sm:block print-area">
          <FullTableView
            days={days}
            daysShort={daysShort}
            timeSlots={timeSlots}
            schedule={schedule}
            removeTimeSlot={(time) =>
              removeTimeSlot(
                time,
                timeSlots,
                setTimeSlots,
                schedule,
                setSchedule
              )
            }
            handleDragOver={handleDragOver}
            adjustActivityDuration={(day, time, increase) => {
              const scheduleKey = `${day}-${time}`;
              adjustActivityDuration(
                scheduleKey,
                timeSlots,
                schedule,
                setSchedule,
                increase
              );
            }}
            removeActivity={handleRemoveActivity}
            handleDragStart={(e, activity, fromSchedule, scheduleKey) =>
              handleDragStart(
                setIsDragging,
                setDraggedActivity,
                setDraggedFromSchedule,
                schedule,
                setSchedule,
                timeSlots
              )(e, activity, fromSchedule, scheduleKey)
            }
            handleDragEnd={(e, fromSchedule, scheduleKey) =>
              handleDragEnd(
                setIsDragging,
                setDraggedActivity,
                setDraggedFromSchedule,
                schedule,
                setSchedule,
                timeSlots,
                draggedActivity,
                draggedFromSchedule
              )(e, fromSchedule, scheduleKey)
            }
            handleDrop={(e, day, time) =>
              handleDrop(
                setIsDragging,
                draggedActivity,
                draggedFromSchedule,
                timeSlots,
                schedule,
                setSchedule
              )(e, day, time)
            }
            isDragging={!!isDragging}
          />
        </div>

        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 no-print">
          <p>
            <strong>Instruções:</strong>
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Arraste atividades da lista para a tabela de horários</li>
            <li>
              Atividades começam com 15 minutos (1 bloco) quando colocadas na
              tabela
            </li>
            <li>
              Use as setas ↑↓ para aumentar/diminuir a duração diretamente na
              tabela
            </li>
            <li>Mova atividades já colocadas arrastando-as para outro local</li>
            <li>
              Clique no ícone de lixeira para remover atividades ou horários
            </li>
            <li>Use "Adicionar Horário" para incluir novos slots de tempo</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ScheduleTableSystem;
