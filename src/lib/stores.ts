import { writable } from 'svelte/store'
import { getEmptyRow } from './editList'
import { browser } from '$app/environment'
import type { FoodRow } from './models'

const initialPerDay = readFromStorage('perDay', 1000, (value) => value >= 1000 && value <= 10000)
export const perDay = writable<number>(initialPerDay)

perDay.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('perDay', String(value))
  }
})

const requiredKeys = ['name', 'date', 'grams', 'amount', 'id']
const initialList = readFromStorage(
  'list',
  [getEmptyRow()],
  (value) =>
    Array.isArray(value) &&
    value.filter((item) => !deepEqualFlatArray(Object.keys(item), requiredKeys)).length === 0,
)
export const list = writable<FoodRow[]>(initialList)

list.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('list', JSON.stringify(value || ''))
  }
})

function readFromStorage<T>(key: string, defaultValue: T, isValid: (value: T) => boolean) {
  if (!browser) {
    return defaultValue
  }

  try {
    const storedValue = JSON.parse(window.localStorage.getItem(key) || '')
    if (!isValid(storedValue)) {
      window.localStorage.setItem(key, JSON.stringify(defaultValue))
    }
    return storedValue ?? defaultValue
  } catch (error) {
    return defaultValue
  }
}

function deepEqualFlatArray(a: unknown, b: unknown) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false
  }

  const sortedA = a.slice(0).sort()
  const sortedB = b.slice(0).sort()
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) {
      return false
    }
  }

  return true
}
