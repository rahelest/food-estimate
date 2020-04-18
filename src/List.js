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
            <table style={{margin: "0 auto"}}>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Grams</th>
                    <th>Amount</th>
                </tr>
                {list.map((el, index) => (
                    <tr className="row" key={index}>
                        <td>
                            <input
                                style={{ width: "9em" }}
                                type="text"
                                value={el.name}
                                placeholder="Name"
                                onChange={(e) =>
                                    onChangeData("name", e.target.value, index)
                                }
                            />
                        </td>
                        <td>
                            <input
                                style={{ width: "3em", textAlign: "center" }}
                                value={el.date}
                                placeholder="Date"
                                onChange={(e) =>
                                    onChangeDate(e.target.value, index)
                                }
                            />
                        </td>
                        <td>
                            <input
                                style={{ width: "3em", textAlign: "right" }}
                                type="number"
                                min="0"
                                value={el.grams}
                                placeholder="Grams"
                                onChange={(e) =>
                                    onChangeData("grams", e.target.value, index)
                                }
                            />
                        </td>
                        <td>
                            <input
                                style={{ width: "2em", textAlign: "right" }}
                                type="number"
                                min="1"
                                value={el.amount}
                                placeholder="Amount"
                                onChange={(e) =>
                                    onChangeData(
                                        "amount",
                                        e.target.value,
                                        index
                                    )
                                }
                            />
                        </td>
                        <td>
                            <button onClick={() => removeRow(index)}>-</button>
                        </td>
                    </tr>
                ))}
            </table>
        </>
    );
}

export default List;
