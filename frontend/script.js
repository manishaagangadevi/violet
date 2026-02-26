// -------------------------------
// Populate Hour & Minute Dropdowns
// -------------------------------

function populateTimeSelectors() {
    const hourSelect = document.getElementById("hour");
    const minuteSelect = document.getElementById("minute");

    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        hourSelect.appendChild(option);
    }

    for (let i = 0; i < 60; i++) {
        const option = document.createElement("option");
        option.value = i < 10 ? "0" + i : i;
        option.textContent = i < 10 ? "0" + i : i;
        minuteSelect.appendChild(option);
    }
}

populateTimeSelectors();


// -------------------------------
// Save Letter
// -------------------------------

document.getElementById("letterForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    // Convert 12-hour time to 24-hour format
    let hour = parseInt(document.getElementById("hour").value);
    let minute = document.getElementById("minute").value;
    let ampm = document.getElementById("ampm").value;

    if (!hour || !minute || !ampm) {
        alert("Please select complete time.");
        return;
    }

    if (ampm === "PM" && hour !== 12) {
        hour += 12;
    }
    if (ampm === "AM" && hour === 12) {
        hour = 0;
    }

    hour = hour < 10 ? "0" + hour : hour;

    const formattedTime = `${hour}:${minute}`;

    const data = {
        sender: document.getElementById("sender").value,
        recipient_email: document.getElementById("recipient").value,
        delivery_date: document.getElementById("date").value,
        delivery_time: formattedTime,
        message: document.getElementById("message").value
    };

    const response = await fetch("http://127.0.0.1:5000/save-letter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    alert(result.message);

    document.getElementById("letterForm").reset();

    loadLetters();
});


// -------------------------------
// Load Letters
// -------------------------------

async function loadLetters() {
    const response = await fetch("http://127.0.0.1:5000/letters");
    const letters = await response.json();

    const container = document.getElementById("lettersContainer");
    container.innerHTML = "";

    letters.forEach(letter => {
        const div = document.createElement("div");

        div.style.border = "1px solid purple";
        div.style.margin = "10px";
        div.style.padding = "10px";
        div.style.borderRadius = "8px";

        // Convert 24hr back to 12hr for display
        let [hour, minute] = letter.delivery_time.split(":");
        hour = parseInt(hour);

        let ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12;
        hour = hour ? hour : 12;

        const displayTime = `${hour}:${minute} ${ampm}`;

        const deliveredStatus = letter.delivered === 1
            ? "✅ Delivered"
            : "⏳ Pending";

        div.innerHTML = `
            <strong>From:</strong> ${letter.sender}<br>
            <strong>To:</strong> ${letter.recipient_email}<br>
            <strong>Delivery:</strong> ${letter.delivery_date} at ${displayTime}<br>
            <strong>Status:</strong> ${deliveredStatus}<br><br>
            <strong>Message:</strong><br>
            ${letter.message}
        `;

        container.appendChild(div);
    });
}


// Load letters on page open
loadLetters();