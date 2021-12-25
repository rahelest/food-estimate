import { useLocalStorage } from "./useLocalStorage"

export function useSavedPerDay() {
  const FIELD = "perDay"
  const { load, save } = useLocalStorage()
  return {
    load() {
      const saved = load(FIELD)
      return parseInt(saved, 10) || 1000
    },

    save(value: number) {
      return save(FIELD, value)
    },
  }
}
