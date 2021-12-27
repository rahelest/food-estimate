import { ChangeEventHandler } from "react"
import List from "./List"
import Results from "./Results"
import styles from "./Estimator.module.css"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { selectPerDay, setPerDay } from "../store/perDaySlice"

const MIN_VALUE = 400
const MAX_VALUE = 10000

function Estimator() {
  const dispatch = useAppDispatch()
  const perDay = useAppSelector(selectPerDay)
  const onChangePerDay: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(setPerDay(Number(e.target.value)))
  }

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
      <List />
      {outOfBounds(perDay) ? null : <Results />}
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
