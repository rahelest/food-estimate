import { useEffect } from "react"
import { useLocalStorage } from "../composables/useLocalStorage"
import { FoodRow } from "../models"

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
      <div className="food-input">
        <div className="row">
          <div className="col-md-6">Name</div>
          <div className="col-md-1">#</div>
          <div className="col-md-2">
            Date
            <span title="Enter DDMM and see how dive dot appears automatically!">
              *
            </span>
          </div>
          <div className="col-md-2">Grams</div>
          <div className="col-md-1" />
        </div>
        {list.map((el, index) => (
          <div className="row" key={index}>
            <div className="col-md-6">
              <input
                type="text"
                value={el.name}
                placeholder="Name"
                onChange={(e) => onChangeData("name", e.target.value, index)}
              />
            </div>
            <div className="col-md-1">
              <input
                style={{ textAlign: "right" }}
                type="number"
                min="1"
                value={el.amount}
                placeholder="Amount"
                onClick={(e) => {
                  const target = e.target as HTMLInputElement
                  return target.select()
                }}
                onChange={(e) => onChangeData("amount", e.target.value, index)}
              />
            </div>
            <div className="col-md-2">
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
            <div className="col-md-2">
              <input
                style={{ textAlign: "right" }}
                type="number"
                min="0"
                value={el.grams}
                placeholder="Grams"
                onChange={(e) => onChangeData("grams", e.target.value, index)}
              />
            </div>
            <div className="col-md-1">
              <button className="x" onClick={() => removeRow(index)}>
                ×
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
