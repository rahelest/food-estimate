import * as R from "ramda";
import moment from "moment";
import React from "react";
import "./App.css";

function Results({ list, setList, perDay }) {
    const omitEmpty = list.filter(({ grams }) => grams);
    const { date, expirations, datePlan } = calculateResults(omitEmpty, perDay);
    return (
        <div className="results">
            Food: {omitEmpty.length} - Days until: {date} <p />
            <div style={{ float: "left" }}>
                {date && renderExpirations(expirations)}
            </div>
            <div style={{ float: "left" }}>
                {date && (
                    <>
                        <em>Plan:</em> <p />
                        <ul
                            style={{
                                textAlign: "left",
                                margin: "0 auto",
                                display: "inline-block"
                            }}
                        >
                            {renderPlan(datePlan)}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default Results;

function renderPlan(plan) {
    return R.toPairs(plan).map(([day, food], index) => (
        <li key={index}>
            <div style={{ color: "#666" }}>{day}: </div>
            <ul>
                {food.map(
                    ({ foodItem: { name, date, grams, usedGrams, amount, nr } }, ind2) => (
                        <li key={ind2}>
                            {name} #{nr} ({usedGrams} / {grams}g),{" "}
                            {date.replace(/(\d\d)(\d\d)/, "$2.$1")}
                        </li>
                    )
                )}
            </ul>
        </li>
    ));
}

function renderExpirations(expirations) {
    if (!expirations.length) return false;

    const expirationList = expirations.map(({ name, date, grams }, ind2) => (
        <li key={ind2}>
            {name} ({grams}g), {date.replace(/(\d\d)(\d\d)/, "$2.$1")}
        </li>
    ));

    return (
        <>
            <em>Food that will expire:</em> <p />
            <ul>{expirationList}</ul>
        </>
    );
}

function isExpired(foodItem, activeDay) {
    return foodItem.dateMoment.isBefore(activeDay, "day");
    // || foodItem.dateMoment.isSame(activeDay, "day")
}

function calculateResults(list, perDay) {
    if (perDay < 700 || perDay > 4000) return {};
    const expirations = [];
    const plan = [];
    const sortableDate = list.map(obj => ({
        ...obj,
        dateMonthDay: obj.date.replace(/(\d\d?).(\d\d)/, "$2$1"),
        dateMoment: moment(obj.date, "DDMM"),
        grams: parseInt(obj.grams, 10),
    }));
    const duplicateByAmount = sortableDate.flatMap(food => {
        return R.times((i) => ({...food, nr: i + 1}), food.amount);
    });
    const dateAsc = R.comparator((a, b) => a.dateMonthDay < b.dateMonthDay);
    const sorted = R.sort(dateAsc, duplicateByAmount);

    let activeDay = moment().add(1, "day");
    let activeDayUsed = 0;

    for (const foodItem of sorted) {
        if (isExpired(foodItem, activeDay)) {
            expirations.push(foodItem);
            continue;
        }

        activeDayUsed += foodItem.grams;
        console.log(foodItem);
        foodItem.usedGrams =
            activeDayUsed >= perDay
                ? foodItem.grams - (activeDayUsed - perDay)
                : foodItem.grams;
        plan.push({
            day: activeDay.format("ddd, DD.MM"),
            foodItem: {...foodItem}
        });
        while (activeDayUsed >= perDay) {
            // next day, carry over
            activeDay = moment(activeDay).add(1, "day");
            activeDayUsed = activeDayUsed - perDay;

            if (activeDayUsed > 0) {
                foodItem.usedGrams = foodItem.grams - foodItem.usedGrams;

                plan.push({
                    day: activeDay.format("ddd, DD.MM"),
                    foodItem: {...foodItem}
                });

                if (isExpired(foodItem, activeDay)) {
                    expirations.push(foodItem);
                }
            }
        }
    }

    console.log(plan);

    const byDate = R.groupBy(({ day }) => day);
    const datePlan = byDate(plan);

    return { date: activeDay.format("ddd, DD.MM"), expirations, datePlan };
}

/*


02.04.2020	500
03.04.2020	400
03.04.2020	400
03.04.2020	450
03.04.2020	450
03.04.2020	500
03.04.2020	500
03.04.2020	500
04.04.2020	280
09.04.2020	500
09.04.2020	500
28.03.2020	400
29.03.2020	400
31.03.2020	600
31.03.2020	600*/
