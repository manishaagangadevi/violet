from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime

app = Flask(__name__)
CORS(app)

# -----------------------------
# DATABASE INITIALIZATION
# -----------------------------

def init_db():
    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS letters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender TEXT,
            recipient_email TEXT,
            delivery_date TEXT,
            delivery_time TEXT,
            message TEXT,
            created_at TEXT,
            delivered INTEGER DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()

init_db()

# -----------------------------
# HOME
# -----------------------------

@app.route("/")
def home():
    return "Violet TimeCapsule Backend Running 💌"

# -----------------------------
# SAVE LETTER
# -----------------------------

@app.route("/save-letter", methods=["POST"])
def save_letter():
    data = request.get_json()

    required_fields = ["sender", "recipient_email", "delivery_date", "delivery_time", "message"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO letters 
        (sender, recipient_email, delivery_date, delivery_time, message, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data["sender"],
        data["recipient_email"],
        data["delivery_date"],
        data["delivery_time"],
        data["message"],
        str(datetime.datetime.now())
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Letter saved successfully 💌"}), 201

# -----------------------------
# GET ALL LETTERS
# -----------------------------

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
            "delivery_time": row[4],
            "message": row[5],
            "created_at": row[6],
            "delivered": row[7]
        })

    return jsonify(letters)

# -----------------------------
# CHECK & DELIVER LETTERS
# -----------------------------

@app.route("/check-delivery", methods=["GET"])
def check_delivery():
    now = datetime.datetime.now()

    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, delivery_date, delivery_time 
        FROM letters 
        WHERE delivered = 0
    """)

    rows = cursor.fetchall()

    delivered_count = 0

    for row in rows:
        letter_id = row[0]
        delivery_date = row[1]
        delivery_time = row[2]

        delivery_datetime_str = f"{delivery_date} {delivery_time}"
        delivery_datetime = datetime.datetime.strptime(delivery_datetime_str, "%Y-%m-%d %H:%M")

        if now >= delivery_datetime:
            cursor.execute("""
                UPDATE letters
                SET delivered = 1
                WHERE id = ?
            """, (letter_id,))
            delivered_count += 1

    conn.commit()
    conn.close()

    return jsonify({
        "message": f"{delivered_count} letters delivered 💌",
        "current_time": str(now)
    })

# -----------------------------

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)