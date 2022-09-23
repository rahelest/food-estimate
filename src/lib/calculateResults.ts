import type { FoodRow, HelperFoodRow, Plan, PlanRow } from './models'
import type { UnixTime } from './utils/date'
import { formatDateWithWeekNames, isBefore, parseDate, tomorrow } from './utils/date'
import { groupBy, serial, sort } from './utils/utils'

function isExpired(foodItem: HelperFoodRow, activeDay: UnixTime) {
  return isBefore(foodItem.unixTime, activeDay)
  // || foodItem.dateMoment.isSame(activeDay, "day")
}

export function calculateResults(
  list: FoodRow[],
  perDay: number,
): {
  date: string
  expirations: HelperFoodRow[]
  datePlan: Plan
} {
  const expirations: HelperFoodRow[] = []
  const plan: PlanRow[] = []
  const sortableDate = (list || []).map((obj) => ({
    ...obj,
    unixTime: parseDate(obj.date),
  }))

  const duplicateByAmount: HelperFoodRow[] = sortableDate.flatMap((food) =>
    serial(food.amount || 1).map((i) => ({ ...food, nr: i + 1 })),
  )

  const sorted = sort(duplicateByAmount, (a: HelperFoodRow, b: HelperFoodRow) => {
    return a.unixTime - b.unixTime
  })

  let activeDay = tomorrow()
  let activeDayUsed = 0

  for (const foodItem of sorted) {
    if (isExpired(foodItem, activeDay)) {
      expirations.push(foodItem)
      continue
    }

    activeDayUsed += foodItem.grams
    foodItem.usedGrams =
      activeDayUsed >= perDay ? foodItem.grams - (activeDayUsed - perDay) : foodItem.grams
    plan.push({
      day: formatDateWithWeekNames(activeDay),
      foodItem: { ...foodItem },
    })

    while (activeDayUsed >= perDay) {
      // next day, carry over
      activeDay = tomorrow(activeDay)
      activeDayUsed = activeDayUsed - perDay

      if (activeDayUsed > 0) {
        foodItem.usedGrams = foodItem.grams - foodItem.usedGrams

        plan.push({
          day: formatDateWithWeekNames(activeDay),
          foodItem: { ...foodItem },
        })

        if (isExpired(foodItem, activeDay)) {
          expirations.push(foodItem)
        }
      }
    }
  }

  const datePlan: Plan = groupBy(plan, ({ day }: PlanRow) => day)
  return { date: formatDateWithWeekNames(activeDay), expirations, datePlan }
}
