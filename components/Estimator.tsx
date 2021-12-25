import { ChangeEventHandler, useState } from "react"
import List from "./List"
import Results from "./Results"
import { FoodRow } from "../models"
import styles from "./Estimator.module.css"
import { useSavedList, useSavedPerDay } from "../composables/useSavedData"

function Estimator() {
  const { load: loadSavedList } = useSavedList()
  const { load: loadSavedPerDay, save: savePerDay } = useSavedPerDay()

  const [list, setList] = useState<FoodRow[]>(loadSavedList)
  const [perDay, setPerDay] = useState<number>(loadSavedPerDay)

  const onChangePerDay: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    const asNumber = parseInt(value, 10)

    // Ignore too large and too small
    if (asNumber < 400 || asNumber > 4000) {
      return
    }

    setPerDay(asNumber)
    savePerDay(asNumber)
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
      <List list={list} setList={setList} />
      <Results list={list} perDay={perDay} />
    </>
  )
}

export default Estimator
