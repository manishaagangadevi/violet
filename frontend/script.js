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


// Save Letter
document.getElementById("letterForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    let hour = parseInt(document.getElementById("hour").value);
    let minute = document.getElementById("minute").value;
    let ampm = document.getElementById("ampm").value;

    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    hour = hour < 10 ? "0" + hour : hour;
    const formattedTime = `${hour}:${minute}`;

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
function typeWriter(element, text, speed = 20) {
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


// Load Letters with Envelope Animation
async function loadLetters() {
    const response = await fetch("http://127.0.0.1:5000/letters");
    const letters = await response.json();
    lettersContainer.innerHTML = "";

    letters.forEach(letter => {
        const card = document.createElement("div");
        card.className = "letter-card";

        const envelope = document.createElement("div");
        envelope.className = "envelope";

        const content = document.createElement("div");
        content.innerHTML = `
            <strong>From:</strong> ${letter.sender}<br>
            <strong>To:</strong> ${letter.recipient_email}<br><br>
            <div class="typed"></div>
        `;

        envelope.appendChild(content);
        card.appendChild(envelope);
        lettersContainer.appendChild(card);

        setTimeout(() => envelope.classList.add("open"), 500);

        const typedDiv = content.querySelector(".typed");
        typeWriter(typedDiv, letter.message);
    });
}
loadLetters();


// Real Petal Particle System
const canvas = document.getElementById("petalCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let petals = [];
for (let i = 0; i < 30; i++) {
    petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 2,
        speed: Math.random() * 1 + 0.5
    });
}

function drawPetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "pink";

    petals.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speed;
        if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(drawPetals);
}
drawPetals();