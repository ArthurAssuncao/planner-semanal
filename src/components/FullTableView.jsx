import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ContextMenu } from "./ContextMenu";

export const FullTableView = ({
  days,
  daysShort,
  timeSlots,
  schedule,
  setSchedule,
  removeTimeSlot,
  handleDragOver,
  handleDrop,
  adjustActivityDuration,
  removeActivity,
  handleDragStart,
  handleDragEnd,
  isDragging,
}) => {
  // Função para agrupar os períodos consecutivos
  const groupPeriods = () => {
    const groups = [];
    let currentGroup = null;

    timeSlots.forEach((slot, index) => {
      if (!currentGroup || currentGroup.period !== slot.period) {
        currentGroup = {
          period: slot.period,
          startIndex: index,
          count: 1,
        };
        groups.push(currentGroup);
      } else {
        currentGroup.count++;
      }
    });

    return groups;
  };

  const periodGroups = groupPeriods();

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e, day, time, activity) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      day,
      time,
      activity,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleDuplicateBelow = () => {
    if (!contextMenu) return;

    const { day, time, activity } = contextMenu;
    const timeIndex = timeSlots.findIndex((slot) => slot.time === time);

    if (timeIndex < timeSlots.length - 1) {
      const newTime = timeSlots[timeIndex + 1].time;
      const newKey = `${day}-${newTime}`;

      if (!schedule[newKey]) {
        const newSchedule = { ...schedule };
        newSchedule[newKey] = {
          ...activity,
          duration: 1,
          isFirst: true,
        };
        setSchedule(newSchedule);
      }
    }

    closeContextMenu();
  };

  const handleDuplicateNextDay = () => {
    if (!contextMenu) return;

    const { day, time, activity } = contextMenu;
    const dayIndex = days.indexOf(day);

    if (dayIndex < days.length - 1) {
      const nextDay = days[dayIndex + 1];
      const newKey = `${nextDay}-${time}`;

      if (!schedule[newKey]) {
        const newSchedule = { ...schedule };
        newSchedule[newKey] = {
          ...activity,
          duration: 1,
          isFirst: true,
        };
        setSchedule(newSchedule);
      }
    }

    closeContextMenu();
  };

  const handleRemoveActivity = () => {
    if (!contextMenu) return;

    const { day, time } = contextMenu;
    removeActivity(`${day}-${time}`);
    closeContextMenu();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        closeContextMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  const contextActions = [
    {
      label: "Duplicar para célula abaixo",
      handler: handleDuplicateBelow,
    },
    {
      label: "Duplicar para próximo dia",
      handler: handleDuplicateNextDay,
    },
    {
      label: "Remover",
      handler: handleRemoveActivity,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          actions={contextActions}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-100 z-[100]">
            <tr className="">
              <th className="px-4 py-3 print:py-0 text-left font-semibold text-gray-700 border-r">
                Turno
              </th>
              <th className="px-4 py-3 print:py-0 text-left font-semibold text-gray-700 border-r">
                Horário
              </th>
              <th className="px-2 py-3 print:py-0 text-left font-semibold text-gray-700 w-4 print:hidden"></th>
              {days.map((day) => (
                <th
                  key={day}
                  className="px-4 py-3 print:py-0 text-center font-semibold text-gray-700 border-l min-w-32"
                >
                  <span className="lg:hidden">
                    {daysShort[days.indexOf(day)]}
                  </span>
                  <span className="hidden lg:inline">{day}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, index) => {
              // Encontra o grupo ao qual este slot pertence
              const group = periodGroups.find(
                (g) => index >= g.startIndex && index < g.startIndex + g.count
              );
              const isFirstInGroup = index === group.startIndex;

              return (
                <tr
                  key={slot.time}
                  className={`border-t hover:bg-sky-100 transition-all odd:bg-white even:bg-gray-50 ${
                    isFirstInGroup ? "bg-white" : ""
                  }`}
                >
                  {isFirstInGroup ? (
                    <td
                      rowSpan={group.count}
                      className="px-4 py-3 print:py-0 [writing-mode:sideways-lr] text-5xl text-gray-600 border-r bg-gray-50 text-center align-middle"
                    >
                      {slot.period}
                    </td>
                  ) : null}

                  <td className="px-4 py-3 print:py-0 text-sm text-center font-medium text-gray-800 border-r bg-gray-50">
                    {slot.time}
                  </td>
                  <td className="px-2 py-3 print:py-0 border-r bg-gray-50 print:hidden">
                    <button
                      onClick={() => removeTimeSlot(slot.time)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remover horário"
                    >
                      <Trash2 size={20} className="transition-colors" />
                    </button>
                  </td>
                  {days.map((day) => {
                    const scheduleKey = `${day}-${slot.time}`;
                    const activity = schedule[scheduleKey];

                    return (
                      <td
                        key={day}
                        className="border-l border-gray-200 p-1 h-12 print:h-0 relative"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day, slot.time)}
                      >
                        {activity ? (
                          activity.isFirst ? (
                            <div
                              draggable
                              onDragEnd={(e) =>
                                handleDragEnd(e, activity, scheduleKey)
                              }
                              onDragStart={(e) =>
                                handleDragStart(e, activity, true, scheduleKey)
                              }
                              onContextMenu={(e) =>
                                handleContextMenu(e, day, slot.time, activity)
                              }
                              className={`w-auto h-full rounded px-2 py-1 print:py-0 text-xs text-white font-medium cursor-move hover:opacity-80 transition-opacity flex items-center justify-between group activity-block`}
                              style={{
                                backgroundColor: activity.color,
                                "--normal-height": `${
                                  activity.duration * 46 +
                                  (activity.duration - 1) * 8 +
                                  (activity.duration - 1) * 1
                                }px`,
                                "--print-height": `${
                                  activity.duration * 20 +
                                  (activity.duration - 1) * 9
                                }px`,
                                height: "var(--normal-height)",
                                position: "absolute",
                                top: "4px",
                                left: "4px",
                                right: "4px",
                                zIndex: 10,
                              }}
                            >
                              <span className="group-hover:truncate">
                                {activity.name}
                              </span>
                              <div className="items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex">
                                <div className="flex flex-col">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      adjustActivityDuration(
                                        day,
                                        slot.time,
                                        true
                                      );
                                    }}
                                    className="text-white hover:text-green-200 p-0.5"
                                    title="Aumentar duração"
                                  >
                                    <ChevronUp size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      adjustActivityDuration(
                                        day,
                                        slot.time,
                                        false
                                      );
                                    }}
                                    className="text-white hover:text-yellow-200 p-0.5"
                                    title="Diminuir duração"
                                  >
                                    <ChevronDown size={16} />
                                  </button>
                                </div>
                                <span className="text-xs mx-1">
                                  {activity.duration * 15}min
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeActivity(day, slot.time);
                                  }}
                                  className="text-white hover:text-red-200 ml-1"
                                  title="Remover atividade"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>
                          ) : null
                        ) : (
                          <div
                            className={`w-full h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hover:border-gray-300 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            {isDragging && (
                              <span className="text-gray-500">Solte aqui</span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
