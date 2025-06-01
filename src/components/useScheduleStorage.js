export const useScheduleStorage = () => {
  const storageKey = "scheduleTableData";

  const loadFromStorage = () => {
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      return null;
    }
  };

  const saveToStorage = (data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  return { loadFromStorage, saveToStorage };
};
