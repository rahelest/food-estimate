import { useLocalStorage } from "./useLocalStorage"
import { FoodRow } from "../models"

export function useSavedPerDay() {
  const FIELD = "perDay"
  const { load, save } = useLocalStorage()
  return {
    load(): number {
      const saved = load(FIELD)
      return parseInt(saved, 10) || 1000
    },

    save(value: number) {
      return save(FIELD, value)
    },
  }
}

export function useSavedList() {
  const { load, save } = useLocalStorage()
  return {
    load(): FoodRow[] {
      const loadedList = load("list")
      return loadedList || [getEmptyRow()]
    },

    save(value: FoodRow[]) {
      return save("list", value)
    },
  }
}

export function getEmptyRow(): FoodRow {
  return { name: "", date: "", grams: 0, amount: 1 }
}
