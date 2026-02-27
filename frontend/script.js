// Populate Time Selectors
function populateTimeSelectors() {
    const hourSelect = document.getElementById("hour");
    const minuteSelect = document.getElementById("minute");

    for (let i = 1; i <= 12; i++) {
        hourSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }

    for (let i = 0; i < 60; i++) {
        const val = i < 10 ? "0" + i : i;
        minuteSelect.innerHTML += `<option value="${val}">${val}</option>`;
    }
}

populateTimeSelectors();


// Convert 12hr to 24hr
function convertTo24Hour(hour, minute, ampm) {
    hour = parseInt(hour);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute}`;
}


// Save Letter
document.getElementById("letterForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const hour = document.getElementById("hour").value;
    const minute = document.getElementById("minute").value;
    const ampm = document.getElementById("ampm").value;

    const formattedTime = convertTo24Hour(hour, minute, ampm);

    const data = {
        sender: sender.value,
        recipient_email: recipient.value,
        delivery_date: date.value,
        delivery_time: formattedTime,
        message: message.value
    };

    await fetch("http://127.0.0.1:5000/save-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    letterForm.reset();
    loadLetters();
});


// Typewriter Effect
function typeWriter(element, text, speed = 15) {
    element.innerHTML = "";
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}


// Load Letters
async function loadLetters() {
    const response = await fetch("http://127.0.0.1:5000/letters");
    const letters = await response.json();

    lettersContainer.innerHTML = "";

    letters.forEach(letter => {

        const card = document.createElement("div");
        card.className = "letter-card";

        let [hour, minute] = letter.delivery_time.split(":");
        hour = parseInt(hour);
        let ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;

        const displayTime = `${hour}:${minute} ${ampm}`;
        const deliveredStatus = letter.delivered === 1 ? "✅ Delivered" : "⏳ Pending";

        card.innerHTML = `
            <strong>From:</strong> ${letter.sender}<br>
            <strong>To:</strong> ${letter.recipient_email}<br>
            <strong>Delivery:</strong> ${letter.delivery_date} at ${displayTime}<br>
            <strong>Status:</strong> ${deliveredStatus}<br><br>
            <div class="typed-text"></div>
        `;

        lettersContainer.appendChild(card);

        const typedDiv = card.querySelector(".typed-text");
        typeWriter(typedDiv, letter.message);
    });
}

loadLetters();