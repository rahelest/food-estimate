import { useEffect, useMemo } from "react"
import styles from "./List.module.css"
import Field from "./Field"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import {
  addRow,
  clear,
  removeRow,
  selectFoodRows,
  updateRow,
} from "../store/foodSlice"

function List() {
  const dispatch = useAppDispatch()
  const list = useAppSelector(selectFoodRows)

  function onChangeNumber(field: string, value: string, id: number) {
    dispatch(updateRow({ field, value: parseInt(value, 10), id }))
  }

  function onChangeDate(value: string, id: number) {
    dispatch(
      updateRow({
        field: "date",
        value: value.replace(/(\d)\.?(\d)(\d\d)/, "$1$2.$3"),
        id,
      })
    )
  }

  const week = useMemo(() => new Date(Date.now() + 1000 * 3600 * 24 * 7), [])
  const dateSuggestions = useMemo(() => {
    const dayMillis = 1000 * 3600 * 24
    const pad = (num: number) => num.toString().padStart(2, "0")
    const range = (n: number) => new Array(n).fill(1).map((e, i) => i + 1)
    return range(7).map((day) => {
      const date = new Date(Date.now() + dayMillis * day)
      return pad(date.getUTCDate()) + "." + pad(date.getUTCMonth() + 1)
    })
  }, [])

  useEffect(() => {
    if (list[list.length - 1].grams) {
      dispatch(addRow())
    }
  }, [list])

  return (
    <div>
      <div className={styles.foodInput}>
        {list.map((row) => (
          <div className={styles.foodRow} key={row.id}>
            <div className={styles.foodColumnName}>
              <Field label="Name">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => {
                    dispatch(
                      updateRow({
                        field: "name",
                        value: e.target.value,
                        id: row.id,
                      })
                    )
                  }}
                />
              </Field>
            </div>
            <div
              className={styles.foodColumnAmount}
              style={{ textAlign: "center" }}
            >
              <Field label="×">
                <input
                  style={{ textAlign: "right" }}
                  type="number"
                  min="1"
                  value={row.amount}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement
                    return target.select()
                  }}
                  onChange={(e) =>
                    onChangeNumber("amount", e.target.value, row.id)
                  }
                />
              </Field>
            </div>
            <div
              className={styles.foodColumnDate}
              style={{ textAlign: "center" }}
            >
              <Field
                label={
                  <span title="Enter DDMM and see how dive dot appears automatically!">
                    Date (!)
                  </span>
                }
              >
                <input
                  style={{ textAlign: "center" }}
                  type="number"
                  step="0.01"
                  lang="en"
                  list="dateList"
                  value={row.date}
                  placeholder={
                    week.getDate().toString().padStart(2, "0") +
                    "." +
                    (week.getMonth() + 1).toString().padStart(2, "0")
                  }
                  onChange={(e) => onChangeDate(e.target.value, row.id)}
                />
              </Field>
              <datalist id="dateList">
                {dateSuggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div
              className={styles.foodColumnGrams}
              style={{ textAlign: "right" }}
            >
              <Field label="Grams">
                <input
                  style={{ textAlign: "right" }}
                  type="number"
                  min="0"
                  list="gramList"
                  value={row.grams}
                  onChange={(e) =>
                    onChangeNumber("grams", e.target.value, row.id)
                  }
                />
              </Field>
              <datalist id="gramList">
                {[100, 200, 250, 500, 1000].map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </div>
            <div className={styles.foodColumnRemove}>
              <button
                className={styles.removeButton}
                onClick={() => dispatch(removeRow(row.id))}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={styles.removeIcon}
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center" }}>
        <button
          onClick={() => dispatch(addRow())}
          className={styles.primaryButton}
        >
          Add row
        </button>{" "}
        <button
          onClick={() => dispatch(clear())}
          className={styles.secondaryButton}
        >
          Clear list
        </button>
      </p>
    </div>
  )
}

export default List
