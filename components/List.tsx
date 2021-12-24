import { useEffect } from "react"
import { useLocalStorage } from "../composables/useLocalStorage"
import { FoodRow } from "../models"
import styles from "./List.module.css"

type Props = {
  list: FoodRow[]
  setList: (list: FoodRow[]) => void
  emptyRow: FoodRow
}

function List({ list, setList, emptyRow }: Props) {
  const { save } = useLocalStorage()

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
    copy.push({ ...emptyRow })
    setList(copy)
  }

  function removeRow(index: number) {
    const copy = [...list]
    copy.splice(index, 1)
    setList(copy)
  }

  function clear() {
    setList([{ ...emptyRow }])
  }

  useEffect(() => {
    save("list", list)
  }, [list])

  return (
    <div>
      <div className={styles.foodInput}>
        <div className={styles.foodRow}>
          <div className={styles.foodColumnName}>Name</div>
          <div className={styles.foodColumnAmount}>#</div>
          <div className={styles.foodColumnDate}>
            Date
            <span title="Enter DDMM and see how dive dot appears automatically!">
              *
            </span>
          </div>
          <div className={styles.foodColumnGrams}>Grams</div>
          <div className={styles.foodColumnRemove} />
        </div>
        {list.map((el, index) => (
          <div className={styles.foodRow} key={index}>
            <div className={styles.foodColumnName}>
              <input
                type="text"
                value={el.name}
                placeholder="Name"
                onChange={(e) => onChangeData("name", e.target.value, index)}
              />
            </div>
            <div className={styles.foodColumnAmount}>
              <input
                style={{ textAlign: "right" }}
                type="number"
                min="1"
                value={el.amount}
                placeholder="#"
                onClick={(e) => {
                  const target = e.target as HTMLInputElement
                  return target.select()
                }}
                onChange={(e) => onChangeData("amount", e.target.value, index)}
              />
            </div>
            <div className={styles.foodColumnDate}>
              <input
                style={{ textAlign: "center" }}
                type="number"
                step="0.01"
                lang="en"
                value={el.date}
                placeholder="Date"
                onChange={(e) => onChangeDate(e.target.value, index)}
              />
            </div>
            <div className={styles.foodColumnGrams}>
              <input
                style={{ textAlign: "right" }}
                type="number"
                min="0"
                value={el.grams}
                placeholder="Grams"
                onChange={(e) => onChangeData("grams", e.target.value, index)}
              />
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

      <p>
        <button onClick={addRow}>Add row</button>{" "}
        <button onClick={clear}>Clear list</button>
      </p>
    </div>
  )
}

export default List
