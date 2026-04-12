from flask import Blueprint, jsonify
from app.models.user import User

user_bp = Blueprint("user", __name__)

@user_bp.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get_or_404(user_id)

    # --- Projects ---
    projects = []
    for p in user.projects:
        projects.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack,
            "github_link": p.github_link,
            "status": p.status,
        })

    # --- Posts (SAME SHAPE AS /feed) ---
    posts = []
    for post in user.posts:
        posts.append({
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
        })

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

