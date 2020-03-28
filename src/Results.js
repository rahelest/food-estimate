import React from "react";
import "./App.css";

function Results({ list }) {
    const { date, expirations } = calculateResults(list);
    return (
        <div className="results">
            Food: {list.length} <br />
            Days until: {date} <br />
            {expirations && renderExpirations(expirations)}
        </div>
    );
}

export default Results;

function renderExpirations(expirations) {
    if (!expirations.length) return false;
}

function calculateResults(list) {
    return { date: undefined, expirations: [] };
}
