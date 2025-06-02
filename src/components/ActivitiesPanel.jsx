import { Edit2, GripVertical, Menu, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ActivityModal } from "./ActivityModal";

export const ActivitiesPanel = ({
  activities,
  activitiesCollapsed,
  setActivitiesCollapsed,
  addActivity,
  removeActivityFromList,
  handleDragStart,
  handleDragEnd,
  updateActivity,
}) => {
  const [editingActivity, setEditingActivity] = useState(null);

  const handleEditClick = (activity, e) => {
    e.stopPropagation();
    setEditingActivity(activity);
  };

  const handleSaveActivity = (updatedActivity) => {
    updateActivity(updatedActivity);
    setEditingActivity(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6 no-print">
      <div className="flex items-center justify-between cursor-pointer">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center">
          <GripVertical className="mr-2" size={20} />
          Atividades Disponíveis
          <button
            onClick={(e) => {
              e.stopPropagation();
              addActivity();
            }}
            className="ml-4 p-1 text-blue-500 hover:text-blue-700"
            title="Adicionar atividade"
          >
            <Plus size={18} />
          </button>
        </h2>
        <button
          onClick={() => setActivitiesCollapsed(!activitiesCollapsed)}
          className="sm:hidden p-2"
        >
          <Menu size={20} />
        </button>
      </div>

      <div
        className={`transition-all duration-300 ${
          activitiesCollapsed ? "hidden sm:block" : "block"
        }`}
      >
        <div className="flex flex-wrap gap-2 mt-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center group relative">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, activity)}
                onDragEnd={(e) => handleDragEnd(e, activity)}
                onClick={(e) => handleEditClick(activity, e)}
                className="px-3 py-2 rounded-lg text-white font-medium cursor-pointer hover:opacity-80 transition-opacity select-none touch-manipulation text-sm flex-1"
                style={{ backgroundColor: activity.color }}
              >
                {activity.name}
              </div>
              <div className="flex ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEditClick(activity, e)}
                  className="p-1 text-yellow-500 hover:text-yellow-700"
                  title="Editar atividade"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => removeActivityFromList(activity.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remover atividade"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Arraste atividades para a tabela ou clique no + para adicionar
        </p>
      </div>

      {editingActivity && (
        <ActivityModal
          activity={editingActivity}
          onSave={handleSaveActivity}
          onClose={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
};
