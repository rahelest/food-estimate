import React, { useState } from "react";
import List from "./List";
import Results from "./Results";
import "./App.css";

function App() {
    const emptyRow = { date: "", grams: "" };
    const [list, setList] = useState([{...emptyRow}]);
    return (
        <div className="App">
            <List list={list} setList={setList} emptyRow={emptyRow} />
            <Results list={list} />
        </div>
    );
}

export default App;
