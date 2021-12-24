import { ChangeEventHandler, useMemo, useState } from "react"
import List from "./List"
import Results from "./Results"
import { useLocalStorage } from "../composables/useLocalStorage"
import { FoodRow } from "../models"
import styles from "./Estimator.module.css"

function Estimator() {
  const { load, save } = useLocalStorage()
  const savedPerDay = useMemo(() => {
    const saved = load("perDay")
    return parseInt(saved, 10)
  }, [load])

  const emptyRow: FoodRow = { name: "", date: "", grams: 0, amount: 1 }
  const [list, setList] = useState<FoodRow[]>(load("list") || [{ ...emptyRow }])
  const [perDay, setPerDay] = useState<number>(savedPerDay || 1000)

  const onChangePerDay: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    const asNumber = parseInt(value, 10)

    // Ignore too large and too small
    if (asNumber < 400 || asNumber > 4000) {
      return
    }

    setPerDay(asNumber)
    save("perDay", asNumber)
  }

  return (
    <>
      <h2 className={styles.title}>Food estimator!</h2>
      Food consumed per day:{" "}
      <input
        value={perDay}
        type="number"
        onChange={onChangePerDay}
        className={styles.perDayInput}
      />
      grams
      <List list={list} setList={setList} emptyRow={emptyRow} />
      <Results list={list} perDay={perDay} />
    </>
  )
}

export default Estimator
