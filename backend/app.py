from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

letters = []

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

    letter = {
        "sender": data["sender"],
        "recipient_email": data["recipient_email"],
        "delivery_date": data["delivery_date"],
        "message": data["message"],
        "created_at": str(datetime.datetime.now())
    }

    letters.append(letter)

    return jsonify({
        "message": "Letter saved successfully 💌",
        "data": letter
    }), 201


if __name__ == "__main__":
    app.run(debug=True)