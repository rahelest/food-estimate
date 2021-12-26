import { useEffect, useMemo } from "react"
import { FoodRow } from "../models"
import styles from "./List.module.css"
import Field from "./Field"
import { getEmptyRow, useSavedList } from "../composables/useSavedData"

type Props = {
  list: FoodRow[]
  setList: (list: FoodRow[]) => void
}

function List({ list, setList }: Props) {
  const { save: saveList } = useSavedList()

  function onChangeData(field: string, value: string | number, _id: number) {
    setList(
      list.map((item) => {
        if (item.id !== _id) return item
        return { ...item, [field]: value }
      })
    )
  }

  function onChangeNumber(field: string, value: string, index: number) {
    const newValue = parseInt(value, 10)
    onChangeData(field, newValue, index)
  }

  function onChangeDate(value: string, index: number) {
    const newValue = value.replace(/(\d)\.?(\d)(\d\d)/, "$1$2.$3")
    onChangeData("date", newValue, index)
  }

  function addRow() {
    setList(list.concat(getEmptyRow()))
  }

  function removeRow(_id: number) {
    setList(list.filter(({ id }) => id !== _id))
  }

  function clear() {
    setList([getEmptyRow()])
  }

  const week = useMemo(() => new Date(Date.now() + 1000 * 3600 * 24 * 7), [])

  useEffect(() => {
    saveList(list)
  }, [list, saveList])

  useEffect(() => {
    if (list[list.length - 1].grams) {
      addRow()
    }
  }, [list, saveList])

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
                  onChange={(e) => onChangeData("name", e.target.value, row.id)}
                />
              </Field>
            </div>
            <div
              className={styles.foodColumnAmount}
              style={{ textAlign: "right" }}
            >
              <Field label="#">
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
                  value={row.date}
                  placeholder={
                    week.getDate().toString().padStart(2, "0") +
                    "." +
                    (week.getMonth() + 1).toString().padStart(2, "0")
                  }
                  onChange={(e) => onChangeDate(e.target.value, row.id)}
                />
              </Field>
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
                  value={row.grams}
                  onChange={(e) =>
                    onChangeNumber("grams", e.target.value, row.id)
                  }
                />
              </Field>
            </div>
            <div className={styles.foodColumnRemove}>
              <button
                className={styles.removeButton}
                onClick={() => removeRow(row.id)}
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
        <button onClick={addRow} className={styles.primaryButton}>
          Add row
        </button>{" "}
        <button onClick={clear} className={styles.secondaryButton}>
          Clear list
        </button>
      </p>
    </div>
  )
}

export default List
