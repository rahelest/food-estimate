import { FoodRow, HelperFoodRow, Plan, PlanRow } from "../models"
import { useMemo } from "react"
import styles from "./Results.module.css"
import {
  formatDateWithWeekNames,
  isBefore,
  parseDate,
  tomorrow,
  UnixTime,
} from "../utils/date"
import { groupBy, serial, sort } from "../utils/utils"
import { useAppSelector } from "../store/hooks"
import { selectPerDay } from "../store/perDaySlice"
import { selectFoodRows } from "../store/foodSlice"

function Results() {
  const perDay = useAppSelector(selectPerDay)
  const list = useAppSelector(selectFoodRows)
  const omitEmpty = useMemo(() => list.filter(({ grams }) => grams), [list])
  const { date, expirations, datePlan } = useMemo(
    () => calculateResults(omitEmpty, perDay),
    [omitEmpty, perDay]
  )

  return (
    <>
      {/* Summary */}
      <section className={styles.summary}>
        <div>
          <label>Food:</label> {omitEmpty.length} item
          {omitEmpty.length !== 1 ? "s" : ""}
        </div>
        <div>
          <label>Lasts until:</label> {date}
        </div>
      </section>
      {/* ----- */}
      <div className={styles.results}>
        {/* Expirations */}
        {date && expirations?.length ? (
          <section className={styles.block}>
            <h3 className={styles.title}>Food that will expire</h3>
            <ul className={styles.list}>
              {expirations.map(({ name, date, grams }, index) => (
                <li key={index}>
                  {name} ({grams}g), {date.replace(/(\d\d)(\d\d)/, "$2.$1")}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {/* ---- */}
        {/* Plan */}
        {date && (
          <section className={styles.block}>
            <h3 className={styles.title}>Plan</h3>
            <ul className={styles.list}>
              {Object.entries(datePlan).map(([day, foodList], index) => (
                <li key={index}>
                  <div style={{ color: "#666" }}>{day}: </div>
                  <ul className={styles.list}>
                    {foodList.map((planRow: PlanRow, ind2: number) => {
                      const { name, date, grams, usedGrams, nr } =
                        planRow.foodItem
                      return (
                        <li key={ind2}>
                          {name} #{nr} ({usedGrams} / {grams}g),{" "}
                          {date.replace(/(\d\d)(\d\d)/, "$2.$1")}
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
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
