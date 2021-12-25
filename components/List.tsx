import { useEffect } from "react"
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

  function onChangeData(field: string, value: string, index: number) {
    const copy = [...list]
    copy[index] = { ...copy[index], [field]: value }
    setList(copy)

    if (index + 1 === copy.length && copy[index].grams) {
      addRow()
    }
  }

  function onChangeDate(value: string, index: number) {
    const newValue = value.replace(/(\d)\.?(\d)(\d\d)/, "$1$2.$3")
    onChangeData("date", newValue, index)
  }

  function addRow() {
    const copy = [...list]
    copy.push(getEmptyRow())
    setList(copy)
  }

  function removeRow(index: number) {
    const copy = [...list]
    copy.splice(index, 1)
    setList(copy)
  }

  function clear() {
    setList([getEmptyRow()])
  }

  useEffect(() => {
    saveList(list)
  }, [list, saveList])

  return (
    <div>
      <div className={styles.foodInput}>
        {list.map((el, index) => (
          <div className={styles.foodRow} key={index}>
            <div className={styles.foodColumnName}>
              <Field label="Name">
                <input
                  type="text"
                  value={el.name}
                  onChange={(e) => onChangeData("name", e.target.value, index)}
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
                  value={el.amount}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement
                    return target.select()
                  }}
                  onChange={(e) =>
                    onChangeData("amount", e.target.value, index)
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
                    Date *
                  </span>
                }
              >
                <input
                  style={{ textAlign: "center" }}
                  type="number"
                  step="0.01"
                  lang="en"
                  value={el.date}
                  onChange={(e) => onChangeDate(e.target.value, index)}
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
                  value={el.grams}
                  onChange={(e) => onChangeData("grams", e.target.value, index)}
                />
              </Field>
            </div>
            <div className={styles.foodColumnRemove}>
              <button
                className={styles.removeButton}
                onClick={() => removeRow(index)}
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
