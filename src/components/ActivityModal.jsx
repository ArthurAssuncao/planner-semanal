import { useState } from 'react';
import { predefinedColors } from './constants';

export const ActivityModal = ({ 
  activity, 
  onSave, 
  onClose 
}) => {
  const [name, setName] = useState(activity?.name || '');
  const [color, setColor] = useState(activity?.color || '#3B82F6');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...activity,
      name,
      color
    });
    onClose();
  };

  const handleColorClick = (newColor) => {
    setColor(newColor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Editar Atividade</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Atividade
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor
            </label>
            <div className="flex items-center mb-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 cursor-pointer mr-3"
              />
              <span className="text-sm text-gray-600">{color}</span>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Cores pré-definidas:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    className="w-8 h-8 rounded-full cursor-pointer border-2 transition-all"
                    style={{
                      backgroundColor: colorOption,
                      borderColor: color === colorOption ? '#000' : 'transparent',
                      transform: color === colorOption ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onClick={() => handleColorClick(colorOption)}
                    title={colorOption}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};