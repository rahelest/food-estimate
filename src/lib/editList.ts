import type { FoodRow } from './models'

const idGenerator = generateId()

function getId(): number {
  // @ts-ignore
  return idGenerator.next().value || -1
}

function* generateId() {
  let lastUsed = 0

  while (true) {
    const now = Date.now()
    lastUsed = now > lastUsed ? now : lastUsed + 1
    yield lastUsed
  }
}

export function getEmptyRow(): FoodRow {
  return { name: '', date: '', grams: 0, amount: 1, id: getId() }
}
