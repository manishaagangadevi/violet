const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const form = document.getElementById("letterForm");
const container = document.getElementById("lettersContainer");

/* Populate Time */
function populateTime() {
    for (let i = 1; i <= 12; i++) {
        hour.innerHTML += `<option value="${i}">${i}</option>`;
    }
    for (let i = 0; i < 60; i++) {
        let val = i < 10 ? "0" + i : i;
        minute.innerHTML += `<option value="${val}">${val}</option>`;
    }
}
populateTime();

/* Form Submit */
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const sender = document.getElementById("sender").value;
    const recipient = document.getElementById("recipient").value;
    const date = document.getElementById("date").value;
    const hourVal = hour.value;
    const minuteVal = minute.value;
    const ampm = document.getElementById("ampm").value;
    const message = document.getElementById("message").value;

    const letterDiv = document.createElement("div");
    letterDiv.classList.add("letter-card");

    letterDiv.innerHTML = `
        <div class="envelope-front">💌 Click to Open</div>
        <div class="letter-content hidden">
            <p><strong>From:</strong> ${sender}</p>
            <p><strong>To:</strong> ${recipient}</p>
            <p><strong>Delivery:</strong> ${date} at ${hourVal}:${minuteVal} ${ampm}</p>
            <hr>
            <p>${message}</p>
        </div>
    `;

    container.prepend(letterDiv);
    form.reset();
});

/* Envelope open */
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("envelope-front")) {
        const content = e.target.nextElementSibling;
        content.classList.remove("hidden");
        e.target.style.display = "none";
    }
});

/* Dark Mode */
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
});