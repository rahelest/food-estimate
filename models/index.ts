export interface FoodRow {
  id: number
  name: string
  date: string
  grams: number
  amount: number
}

export interface HelperFoodRow extends FoodRow {
  unixTime: number
  usedGrams?: number
  nr: number
}

export interface PlanRow {
  day: string
  foodItem: HelperFoodRow
}

export type Plan = Record<string, PlanRow[]>
