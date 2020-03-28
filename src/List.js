import React from "react";
import "./App.css";

function List({ list, setList, emptyRow }) {
    function onChangeData(field, value, index) {
        const copy = [...list];
        copy[index][field] = value;
        setList(copy);
    }

    function addRow(index) {
        const copy = [...list];
        copy.push({...emptyRow});
        setList(copy);
    }

    function removeRow(index) {
        const copy = [...list];
        copy.splice(index, 1);
        setList(copy);
    }

    return (
        <>
        <button onClick={addRow}>+</button> <br />
            {list.map((el, index) => (
                <div className="row" key={index}>
                    <input
                        value={el.date}
                        onChange={e =>
                            onChangeData("date", e.target.value, index)
                        }
                    />
                    <input
                        value={el.grams}
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
