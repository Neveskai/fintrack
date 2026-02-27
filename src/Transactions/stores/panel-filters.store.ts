import { useSharedDateStore } from './shared-date.store'

export const usePanelFiltersStore = () => {
  const { selectedDate, setSelectedDate } = useSharedDateStore()

  return {
    selectedDate,
    setSelectedDate,
    reset: () => setSelectedDate(new Date())
  }
}
