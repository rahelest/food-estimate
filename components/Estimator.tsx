import { ChangeEventHandler, useMemo, useState } from "react"
import List from "./List"
import Results from "./Results"
import { useLocalStorage } from "../composables/useLocalStorage"

function Estimator() {
  const { load, save } = useLocalStorage()
  const savedPerDay = useMemo(() => {
    const saved = load("perDay")
    return parseInt(saved, 10)
  }, [load])

  const emptyRow = { name: "", date: "", grams: "", amount: 1 }
  const [list, setList] = useState(load("list") || [{ ...emptyRow }])
  const [perDay, setPerDay] = useState<number>(savedPerDay || 1000)

  const onChangePerDay: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setPerDay(parseInt(value, 10))
    save("perDay", value)
  }

  return (
    <div className="App">
      <h2>Food estimator!</h2>
      Food consumed per day:{" "}
      <input
        value={perDay}
        type="number"
        onChange={onChangePerDay}
        style={{ width: "60px", textAlign: "center" }}
      />{" "}
      grams
      <List list={list} setList={setList} emptyRow={emptyRow} />
      <Results list={list} setList={setList} perDay={perDay} />
    </div>
  )
}

export default Estimator
