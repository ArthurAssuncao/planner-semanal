import { Clock, Download, Plus, Printer, RotateCcw, Upload } from 'lucide-react';

export const ControlsPanel = ({ 
  addTimeSlot,
  resetTable,
  handlePrint,
  handleExport,
  handleImport,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 flex items-center">
            <Clock className="mr-2" size={20} />
            Gerenciar Horários
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={addTimeSlot}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm sm:text-base touch-manipulation"
            >
              <Plus className="mr-2" size={16} />
              Adicionar Horário
            </button>
            <button
              onClick={resetTable}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center text-sm sm:text-base touch-manipulation"
            >
              <RotateCcw className="mr-2" size={16} />
              Resetar Tabela
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm sm:text-base touch-manipulation"
            >
              <Printer className="mr-2" size={16} />
              Imprimir
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={handleExport}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center text-sm sm:text-base touch-manipulation"
          >
            <Download className="mr-2" size={16} />
            Exportar
          </button>
          <label className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center text-sm sm:text-base touch-manipulation cursor-pointer">
            <Upload className="mr-2" size={16} />
            Importar
            <input 
              type="file" 
              className="hidden" 
              accept=".json"
              onChange={handleImport}
            />
          </label>
        </div>

        <div className="sm:hidden no-print">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Visualização:</label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('tabs')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'tabs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Por Dia
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Todos os Dias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};