import React, { useState } from "react";
import List from "./List";
import Results from "./Results";
import "./App.css";

function App() {
    const emptyRow = { name: "", date: "", grams: "", amount: 1 };
    const [list, setList] = useState(load("list") || [{ ...emptyRow }]);
    const [perDay, setPerDay] = useState(parseInt(load("perDay"), 10) || 1000);

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
            <input value={perDay} onChange={onChangePerDay} style={{ width: "70px" }} />
            <List list={list} setList={setList} emptyRow={emptyRow} />
            <Results list={list} setList={setList} perDay={perDay} />
        </div>
    );
}

function load(field) {
    const storage = localStorage.getItem(field);
    try {
        const parsed = JSON.parse(storage);
        return parsed;
    } catch (err) {
        return undefined;
    }
}

export default App;
