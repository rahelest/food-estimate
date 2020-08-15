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
        <p>
            <div className="food-input">
                <div className="row">
                    <div class="col-md-6">Name</div>
                    <div class="col-md-1">#</div>
                    <div class="col-md-2">
                        Date
                        <span title="Enter DDMM and see how dive dot appears automatically!">*</span>
                    </div>
                    <div class="col-md-2">Grams</div>
                    <div class="col-md-1"></div>
                </div>
                {list.map((el, index) => (
                    <div className="row" key={index}>
                        <div class="col-md-6">
                            <input
                                type="text"
                                value={el.name}
                                placeholder="Name"
                                onChange={(e) =>
                                    onChangeData("name", e.target.value, index)
                                }
                            />
                        </div>
                        <div class="col-md-1">
                            <input
                                style={{ textAlign: "right" }}
                                type="number"
                                min="1"
                                value={el.amount}
                                placeholder="Amount"
                                onClick={(e) => e.target.select(9)}
                                onChange={(e) =>
                                    onChangeData(
                                        "amount",
                                        e.target.value,
                                        index
                                    )
                                }
                            />
                        </div>
                        <div class="col-md-2">
                            <input
                                style={{ textAlign: "center" }}
                                type="number"
                                step="0.01"
                                lang="en"
                                value={el.date}
                                placeholder="Date"
                                onChange={(e) =>
                                    onChangeDate(e.target.value, index)
                                }
                            />
                        </div>
                        <div class="col-md-2">
                            <input
                                style={{ textAlign: "right" }}
                                type="number"
                                min="0"
                                value={el.grams}
                                placeholder="Grams"
                                onChange={(e) =>
                                    onChangeData("grams", e.target.value, index)
                                }
                            />
                        </div>
                        <div class="col-md-1">
                            <button class="x" onClick={() => removeRow(index)}>×</button>
                        </div>
                    </div>
                ))}
            </div>

            <p>
                <button onClick={addRow}>Add row</button>{" "}
                <button onClick={clear}>Clear list</button>
            </p>
        </p>
    );
}

export default List;
