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
});