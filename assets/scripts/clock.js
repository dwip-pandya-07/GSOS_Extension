import State from "./state.js";

export function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    if (State.is12HourFormat) {
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        document.getElementById(
            "time"
        ).textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    } else {
        hours = String(hours).padStart(2, "0");
        document.getElementById(
            "time"
        ).textContent = `${hours}:${minutes}:${seconds}`;
    }
}

export function updateDate() {
    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    document.getElementById("date").textContent = now.toLocaleDateString(
        "en-US",
        options
    );
}

export function startClock() {
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
}