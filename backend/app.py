from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simple in-memory list to store submissions
saved_users = []


@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()

    name  = data.get("name", "").strip()
    email = data.get("email", "").strip()

    # Validate
    if not name:
        return jsonify({"status": "error", "message": "Name is required."}), 400

    if not email or "@" not in email:
        return jsonify({"status": "error", "message": "A valid email is required."}), 400

    # Save only name and email
    user = {"name": name, "email": email}
    saved_users.append(user)

    print(f"[Flask] Saved user: name={name!r}, email={email!r}")
    print(f"[Flask] Total saved: {len(saved_users)}")

    return jsonify({
        "status":  "success",
        "message": f"Saved! Name: {name}, Email: {email}"
    }), 200


@app.route("/users", methods=["GET"])
def get_users():
    return jsonify({"users": saved_users}), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
