import React, { useState } from "react";
import List from "./List";
import Results from "./Results";
import "./App.css";

function App() {
    const emptyRow = { name: "", date: "", grams: "" };
    const [list, setList] = useState(load("list") || [{ ...emptyRow }]);
    const [perDay, setPerDay] = useState(load("perDay") || 1000);

    function onChangePerDay(value) {
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
            <Results list={list} setList={setList} />
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
