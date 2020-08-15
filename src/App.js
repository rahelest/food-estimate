import React, { useState } from "react";
import List from "./List";
import Results from "./Results";
import "./App.css";

function App() {
    let loadFromStorage, err;

    try {
        loadFromStorage = parseInt(load("perDay"), 10);
    } catch (error) {
        err = error;
    }
    const emptyRow = { name: "", date: "", grams: "", amount: 1 };
    const [list, setList] = useState(load("list") || [{ ...emptyRow }]);
    const [perDay, setPerDay] = useState(loadFromStorage || 1000);

    if (err) {
        return <>Problem: {JSON.stringify(err)}</>;
    }

    try {
        function onChangePerDay(e) {
            const value = e.target.value;
            setPerDay(value);
            try {
                localStorage.setItem("perDay", JSON.stringify(value));
            } catch (err) {
                //shrug
            }
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

function load(field) {
    try {
        const storage = localStorage.getItem(field);
        const parsed = JSON.parse(storage);
        return parsed;
    } catch (err) {
        return undefined;
    }
}

export default App;
