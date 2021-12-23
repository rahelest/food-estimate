import * as R from "ramda"
import moment from "moment"
import { FoodRow, HelperFoodRow, Plan, PlanRow } from "../models"
import { useMemo } from "react"

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
            {R.toPairs(datePlan).map(([day, foodList], index) => (
              <li key={index}>
                <div style={{ color: "#666" }}>{day}: </div>
                <ul>
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
        </div>
      )}
    </div>
  )
}

export default Results

function isExpired(foodItem: HelperFoodRow, activeDay: moment.Moment) {
  return foodItem.dateMoment.isBefore(activeDay, "day")
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
    dateMonthDay: obj.date.replace(/(\d\d?).(\d\d)/, "$2$1"),
    dateMoment: moment(obj.date, "DDMM"),
  }))
  const duplicateByAmount: HelperFoodRow[] = sortableDate.flatMap((food) => {
    return R.times((i) => ({ ...food, nr: i + 1 }), food.amount || 1)
  })
  const dateAsc = R.comparator((a: HelperFoodRow, b: HelperFoodRow) => {
    return a.dateMonthDay < b.dateMonthDay
  })
  const sorted = R.sort(dateAsc, duplicateByAmount)

  let activeDay = moment().add(1, "day")
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
      day: activeDay.format("ddd, DD.MM"),
      foodItem: { ...foodItem },
    })

    while (activeDayUsed >= perDay) {
      // next day, carry over
      activeDay = moment(activeDay).add(1, "day")
      activeDayUsed = activeDayUsed - perDay

      if (activeDayUsed > 0) {
        foodItem.usedGrams = foodItem.grams - foodItem.usedGrams

        plan.push({
          day: activeDay.format("ddd, DD.MM"),
          foodItem: { ...foodItem },
        })

        if (isExpired(foodItem, activeDay)) {
          expirations.push(foodItem)
        }
      }
    }
  }

  const byDate = R.groupBy(({ day }: PlanRow) => day)
  const datePlan: Plan = byDate(plan)

  return { date: activeDay.format("ddd, DD.MM"), expirations, datePlan }
}

/*


02.04.2020	500
03.04.2020	400
03.04.2020	400
03.04.2020	450
03.04.2020	450
03.04.2020	500
03.04.2020	500
03.04.2020	500
04.04.2020	280
09.04.2020	500
09.04.2020	500
28.03.2020	400
29.03.2020	400
31.03.2020	600
31.03.2020	600*/
