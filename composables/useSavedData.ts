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
      const ensuredId = loadedList?.map((item: FoodRow) => {
        return {
          ...item,
          id: item.id || getId(),
        }
      })
      return ensuredId || [getEmptyRow()]
    },

    save(value: FoodRow[]) {
      return save("list", value)
    },
  }
}

export function getEmptyRow(): FoodRow {
  return { name: "", date: "", grams: 0, amount: 1, id: getId() }
}

function* generateId() {
  let lastUsed = 0

  while (true) {
    const now = Date.now()
    lastUsed = now > lastUsed ? now : lastUsed + 1
    yield lastUsed
    continue
  }
}

const idGenerator = generateId()
function getId(): number {
  return idGenerator.next().value || -1
}
