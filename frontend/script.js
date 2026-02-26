// Save Letter
document.getElementById("letterForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = {
        sender: document.getElementById("sender").value,
        recipient_email: document.getElementById("recipient").value,
        delivery_date: document.getElementById("date").value,
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

    loadLetters(); // Refresh list after saving
});

// Load Letters
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

        div.innerHTML = `
            <strong>From:</strong> ${letter.sender}<br>
            <strong>To:</strong> ${letter.recipient_email}<br>
            <strong>Delivery Date:</strong> ${letter.delivery_date}<br>
            <strong>Message:</strong><br>
            ${letter.message}
        `;

        container.appendChild(div);
    });
}

// Load letters when page opens
loadLetters();