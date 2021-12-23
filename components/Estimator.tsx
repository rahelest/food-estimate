import { useMemo, useState } from "react";
import List from "./List";
import Results from "./Results";
import { useLocalStorage } from "../composables/useLocalStorage";

function Estimator() {
  let err;
  const { load, save } = useLocalStorage();
  const savedPerDay = useMemo(() => {
    const saved = load("perDay");
    return parseInt(saved, 10);
  }, []);

  const emptyRow = { name: "", date: "", grams: "", amount: 1 };
  const [list, setList] = useState(load("list") || [{ ...emptyRow }]);
  const [perDay, setPerDay] = useState(savedPerDay || 1000);

  if (err) {
    return <>Problem: {JSON.stringify(err)}</>;
  }

  try {
    function onChangePerDay(e) {
      const value = e.target.value;
      setPerDay(value);
      save("perDay", value);
    }

    return (
      <div className="App">
        <h2>Food estimator!</h2>
        Food consumed per day:{" "}
        <input
          value={perDay}
          onChange={onChangePerDay}
          style={{ width: "60px", textAlign: "center" }}
        />{" "}
        grams
        <List list={list} setList={setList} emptyRow={emptyRow} />
        <Results list={list} setList={setList} perDay={perDay} />
      </div>
    );
  } catch (error) {
    err = error;
    return <>Problem: {JSON.stringify(error)}</>;
  }
}

export default Estimator;
