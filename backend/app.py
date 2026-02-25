from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime

app = Flask(__name__)
CORS(app)

# Create database if not exists
def init_db():
    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS letters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender TEXT,
            recipient_email TEXT,
            delivery_date TEXT,
            message TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def home():
    return "Violet TimeCapsule Backend Running 💌"

@app.route("/save-letter", methods=["POST"])
def save_letter():
    data = request.get_json()

    required_fields = ["sender", "recipient_email", "delivery_date", "message"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO letters (sender, recipient_email, delivery_date, message, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data["sender"],
        data["recipient_email"],
        data["delivery_date"],
        data["message"],
        str(datetime.datetime.now())
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Letter saved successfully 💌"}), 201


@app.route("/letters", methods=["GET"])
def get_letters():
    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM letters")
    rows = cursor.fetchall()

    conn.close()

    letters = []
    for row in rows:
        letters.append({
            "id": row[0],
            "sender": row[1],
            "recipient_email": row[2],
            "delivery_date": row[3],
            "message": row[4],
            "created_at": row[5]
        })

    return jsonify(letters)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)