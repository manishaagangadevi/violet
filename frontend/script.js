// SAVE LETTER
document.getElementById("letterForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = {
        sender: document.getElementById("sender").value,
        recipient_email: document.getElementById("recipient").value,
        delivery_date: document.getElementById("date").value,
        delivery_time: document.getElementById("time").value,
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

    loadLetters(); // refresh after saving
});


// LOAD LETTERS
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

        const deliveredStatus = letter.delivered === 1
            ? "✅ Delivered"
            : "⏳ Pending";

        div.innerHTML = `
            <strong>From:</strong> ${letter.sender}<br>
            <strong>To:</strong> ${letter.recipient_email}<br>
            <strong>Delivery:</strong> ${letter.delivery_date} at ${letter.delivery_time}<br>
            <strong>Status:</strong> ${deliveredStatus}<br><br>
            <strong>Message:</strong><br>
            ${letter.message}
        `;

        container.appendChild(div);
    });
}


// LOAD LETTERS WHEN PAGE OPENS
loadLetters();