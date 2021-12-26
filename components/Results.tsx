import { FoodRow, HelperFoodRow, Plan, PlanRow } from "../models"
import { useMemo } from "react"
import {
  formatDateWithWeekNames,
  isBefore,
  tomorrow,
  UnixTime,
} from "../utils/date"
import { groupBy, serial, sort } from "../utils/utils"

type Props = {
  list: FoodRow[]
  perDay: number
}

function Results({ list, perDay }: Props) {
  const omitEmpty = useMemo(() => list.filter(({ grams }) => grams), [list])
  const { date, expirations, datePlan } = useMemo(
    () => calculateResults(omitEmpty, perDay),
    [omitEmpty, perDay]
  )

  return (
    <div className="results">
      Food: {omitEmpty.length} item(s) - Lasts until: {date} <p />
      {date && expirations?.length ? (
        <div style={{ float: "left", marginRight: "40px" }}>
          <h3>Food that will expire:</h3> <p />
          <ul>
            {expirations.map(({ name, date, grams }, index) => (
              <li key={index}>
                {name} ({grams}g), {date.replace(/(\d\d)(\d\d)/, "$2.$1")}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {date && (
        <div style={{ float: "left" }}>
          <h3>Plan:</h3> <p />
          <ul
            style={{
              textAlign: "left",
              margin: "0 auto",
              display: "inline-block",
            }}
          >
            {Object.entries(datePlan).map(([day, foodList], index) => (
              <li key={index}>
                <div style={{ color: "#666" }}>{day}: </div>
                <ul>
                  {foodList.map((planRow: PlanRow, ind2: number) => {
                    const { name, date, grams, usedGrams, nr } =
                      planRow.foodItem
                    return (
                      <li key={ind2}>
                        {name} ×{nr} ({usedGrams} / {grams}g),{" "}
                        {date.replace(/(\d\d)(\d\d)/, "$2.$1")}
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Results

function isExpired(foodItem: HelperFoodRow, activeDay: UnixTime) {
  return isBefore(foodItem.unixTime, activeDay)
  // || foodItem.dateMoment.isSame(activeDay, "day")
}

function calculateResults(
  list: FoodRow[],
  perDay: number
): {
  date: string
  expirations: HelperFoodRow[]
  datePlan: Plan
} {
  const expirations: HelperFoodRow[] = []
  const plan: PlanRow[] = []
  const sortableDate = list.map((obj) => ({
    ...obj,
    unixTime: parseDate(obj.date),
  }))

  const duplicateByAmount: HelperFoodRow[] = sortableDate.flatMap((food) =>
    serial(food.amount || 1).map((i) => ({ ...food, nr: i + 1 }))
  )

  const sorted = sort(
    duplicateByAmount,
    (a: HelperFoodRow, b: HelperFoodRow) => {
      return a.unixTime - b.unixTime
    }
  )

  let activeDay = tomorrow()
  let activeDayUsed = 0

  for (const foodItem of sorted) {
    if (isExpired(foodItem, activeDay)) {
      expirations.push(foodItem)
      continue
    }

    activeDayUsed += foodItem.grams
    foodItem.usedGrams =
      activeDayUsed >= perDay
        ? foodItem.grams - (activeDayUsed - perDay)
        : foodItem.grams
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
