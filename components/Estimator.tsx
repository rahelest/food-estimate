import { ChangeEventHandler, useEffect, useState } from "react"
import List from "./List"
import Results from "./Results"
import { FoodRow } from "../models"
import styles from "./Estimator.module.css"
import { useSavedList, useSavedPerDay } from "../composables/useSavedData"

const MIN_VALUE = 400
const MAX_VALUE = 10000

function Estimator() {
  const { load: loadSavedList } = useSavedList()
  const { load: loadSavedPerDay, save: savePerDay } = useSavedPerDay()

  const [list, setList] = useState<FoodRow[]>(loadSavedList)
  const [perDay, setPerDay] = useState<number>(loadSavedPerDay)

  const onChangePerDay: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setPerDay(parseInt(value, 10))
  }

  useEffect(() => {
    savePerDay(perDay)
  }, [perDay, savePerDay])

  return (
    <>
      <h2 className={styles.title}>Food estimator!</h2>
      Food consumed per day:{" "}
      <input
        value={perDay}
        type="number"
        onChange={onChangePerDay}
        className={classNames(
          styles.perDayInput,
          outOfBounds(perDay) && styles.inputError
        )}
      />
      grams
      {outOfBounds(perDay) ? (
        <label className={styles.error}>
          Per day value should be between {MIN_VALUE} and {MAX_VALUE}
        </label>
      ) : null}
      <List list={list} setList={setList} />
      {outOfBounds(perDay) ? null : <Results list={list} perDay={perDay} />}
    </>
  )
}

export default Estimator

function outOfBounds(perDay: number) {
  return perDay < MIN_VALUE || perDay > MAX_VALUE
}

function classNames(
  ...styles: (string | false | undefined)[]
): string | undefined {
  return styles.filter((s) => s).join(" ")
}
