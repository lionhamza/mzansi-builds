from flask import Blueprint, request, jsonify, session
from app.models.user import User, db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(full_name=full_name, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": f"{full_name} registered successfully!"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ THIS IS WHAT WAS MISSING
    session["user_id"] = user.id

    return jsonify({
        "message": f"Welcome {user.full_name}!",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "profile_image": user.profile_image,
        }
    }), 200


@auth_bp.route("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out"})