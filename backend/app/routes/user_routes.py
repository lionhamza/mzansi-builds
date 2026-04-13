from flask import Blueprint, jsonify, request, session
from werkzeug.utils import secure_filename
from app.extensions import db
from app.models.user import User
import os

user_bp = Blueprint("user", __name__)

# ✅ Correct static folder inside Flask
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "static", "profile_images")
UPLOAD_FOLDER = os.path.abspath(UPLOAD_FOLDER)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@user_bp.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get_or_404(user_id)

    projects = [{
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "tech_stack": p.tech_stack,
        "github_link": p.github_link,
        "status": p.status,
    } for p in user.projects]

    posts = [{
        "id": post.id,
        "message": post.message,
        "post_type": post.post_type,
        "created_at": post.created_at.isoformat(),
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "profile_image": user.profile_image,
        },
        "project": {
            "id": post.project.id,
            "title": post.project.title,
            "tech_stack": post.project.tech_stack,
            "status": post.project.status,
            "github_link": post.project.github_link,
        }
    } for post in user.posts]

    return jsonify({
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "profile_image": user.profile_image,
        },
        "projects": projects,
        "posts": posts
    }), 200


@user_bp.route("/update-profile-image", methods=["POST"])
def update_profile_image():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image"}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    image_url = f"/static/profile_images/{filename}"

    user = User.query.get(user_id)
    user.profile_image = image_url
    db.session.commit()

    return jsonify({"profile_image": image_url}), 200

@user_bp.route("/session-check", methods=["GET"])
def session_check():
    user_id = session.get("user_id")
    return jsonify({
        "has_session": bool(user_id),
        "user_id": user_id
    }), 200
