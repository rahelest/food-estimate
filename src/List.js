import React, { useEffect } from "react";
import "./App.css";

function List({ list, setList, emptyRow }) {
    function onChangeData(field, value, index) {
        const copy = [...list];
        copy[index][field] = value;
        setList(copy);

        if (index + 1 === copy.length && copy[index].grams) {
            addRow();
        }
    }

    function onChangeDate(value, index) {
        let newValue = value.replace(/(\d)(\d\d)/, "$1.$2");
        newValue = value.replace(/(\d)\.?(\d)(\d\d)/, "$1$2.$3");
        onChangeData("date", newValue, index);
    }

    function addRow() {
        const copy = [...list];
        copy.push({ ...emptyRow });
        setList(copy);
    }

    function removeRow(index) {
        const copy = [...list];
        copy.splice(index, 1);
        setList(copy);
    }

    function clear() {
        setList([{ ...emptyRow }]);
    }

    useEffect(() => {
        try {
            localStorage.setItem("list", JSON.stringify(list));
        } catch (err) {
            //shrug
        }
    });

    return (
        <>
            <button onClick={addRow}>+</button>{" "}
            <button onClick={clear}>Clear</button> <br />
            {list.map((el, index) => (
                <div className="row" key={index}>
                    <input
                        style={{ width: "6em" }}
                        type="text"
                        value={el.name}
                        placeholder="Name"
                        onChange={e =>
                            onChangeData("name", e.target.value, index)
                        }
                    />
                    <input
                        style={{ width: "3em", textAlign: "center" }}
                        value={el.date}
                        placeholder="Date"
                        onChange={e => onChangeDate(e.target.value, index)}
                    />
                    <input
                        style={{ width: "3em", textAlign: "right" }}
                        type="number"
                        min="0"
                        value={el.grams}
                        placeholder="Grams"
                        onChange={e =>
                            onChangeData("grams", e.target.value, index)
                        }
                    />
                    <button onClick={() => removeRow(index)}>-</button>
                </div>
            ))}
        </>
    );
}

export default List;
