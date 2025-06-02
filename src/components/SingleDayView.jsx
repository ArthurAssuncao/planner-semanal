import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Trash2,
} from "lucide-react";

export const SingleDayView = ({
  currentDayIndex,
  setCurrentDayIndex,
  days,
  daysShort,
  timeSlots,
  schedule,
  removeTimeSlot,
  handleDragOver,
  handleDrop,
  adjustActivityDuration,
  removeActivity,
  handleDragStart,
}) => {
  const currentDay = days[currentDayIndex];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Navegação entre dias */}
      <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() =>
            setCurrentDayIndex((prev) => (prev === 0 ? 6 : prev - 1))
          }
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <h3 className="text-lg font-semibold text-gray-800">{currentDay}</h3>

        <button
          onClick={() =>
            setCurrentDayIndex((prev) => (prev === 6 ? 0 : prev + 1))
          }
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Navegação por abas dos dias */}
      <div className="bg-gray-50 px-2 py-2 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {days.map((day, index) => (
            <button
              key={day}
              onClick={() => setCurrentDayIndex(index)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                index === currentDayIndex
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="sm:hidden">{daysShort[index]}</span>
              <span className="hidden sm:inline">{day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabela do dia atual */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-700 w-16">
                Turno
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700 w-20">
                Horário
              </th>
              <th className="px-2 py-3 w-8"></th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                {currentDay}
              </th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, index) => {
              const scheduleKey = `${currentDay}-${slot.time}`;
              const activity = schedule[scheduleKey];

              return (
                <tr key={slot.time} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-3 text-xs text-gray-600 bg-gray-50">
                    {slot.period}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-800 bg-gray-50">
                    {slot.time}
                  </td>
                  <td className="px-2 py-3 bg-gray-50">
                    <button
                      onClick={() => removeTimeSlot(slot.time)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remover horário"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                  <td
                    className="border-l border-gray-200 p-1 h-12 relative"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, currentDay, slot.time)}
                  >
                    {activity ? (
                      activity.isFirst ? (
                        <div
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, activity, true, scheduleKey)
                          }
                          className="w-full rounded px-2 py-1 text-xs text-white font-medium cursor-move hover:opacity-80 transition-opacity flex items-center justify-between group activity-block"
                          style={{
                            backgroundColor: activity.color,
                            height: `${activity.duration * 48 - 4}px`,
                            position: "absolute",
                            top: "2px",
                            left: "4px",
                            right: "4px",
                            zIndex: 10,
                          }}
                        >
                          <span className="screen:truncate text-xs">
                            {activity.name}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex flex-col">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  adjustActivityDuration(
                                    currentDay,
                                    slot.time,
                                    true
                                  );
                                }}
                                className="text-white hover:text-green-200 p-1 touch-manipulation"
                                title="Aumentar duração"
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  adjustActivityDuration(
                                    currentDay,
                                    slot.time,
                                    false
                                  );
                                }}
                                className="text-white hover:text-yellow-200 p-1 touch-manipulation"
                                title="Diminuir duração"
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>
                            <span className="text-xs mx-1">
                              {activity.duration * 15}min
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeActivity(currentDay, slot.time);
                              }}
                              className="text-white hover:text-red-200 ml-1 p-1 touch-manipulation"
                              title="Remover atividade"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ) : null
                    ) : (
                      <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hover:border-gray-300 transition-colors touch-manipulation">
                        Toque aqui
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
