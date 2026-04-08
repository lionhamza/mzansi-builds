from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.project import Project
from app.models.post import Post

project_bp = Blueprint("project", __name__)


@project_bp.route("/create-project", methods=["POST"])
def create_project():
    data = request.get_json()

    new_project = Project(
        title=data.get("title"),
        description=data.get("description"),
        tech_stack=data.get("tech_stack"),
        github_link=data.get("github_link"),
        user_id=data.get("user_id"),
    )

    db.session.add(new_project)
    db.session.commit()

    return jsonify({"message": "Project created successfully!"}), 201


@project_bp.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()

    data = []
    for p in projects:
        data.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack,
            "status": p.status,
            "created_at": p.created_at.isoformat(),
            "github_link": p.github_link,
            "user": {
                "id": p.user.id,
                "full_name": p.user.full_name,
                "profile_image": p.user.profile_image
            },
            "posts": [
                {
                    "id": post.id,
                    "message": post.message,
                    "post_type": post.post_type,
                    "created_at": post.created_at.isoformat(),
                }
                for post in p.posts
            ]
        })

    return jsonify(data), 200


@project_bp.route("/my-projects/<int:user_id>", methods=["GET"])
def get_my_projects(user_id):
    projects = (
        Project.query
        .filter_by(user_id=user_id)
        .order_by(Project.created_at.desc())
        .all()
    )

    data = []

    for p in projects:
        data.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack,
            "status": p.status,
            "created_at": p.created_at.isoformat(),
            "github_link": p.github_link,
            "user": {
                "id": p.user.id,
                "full_name": p.user.full_name,
                "profile_image": p.user.profile_image
            },
            "posts": [
                {
                    "id": post.id,
                    "message": post.message,
                    "post_type": post.post_type,
                    "created_at": post.created_at.isoformat(),
                }
                for post in p.posts
            ]
        })

    return jsonify(data), 200


@project_bp.route("/create-post", methods=["POST"])
def create_post():
    data = request.get_json()

    post = Post(
        message=data.get("message"),
        user_id=data.get("user_id"),
        project_id=data.get("project_id")
    )

    db.session.add(post)
    db.session.commit()

    return jsonify({"message": "Post created"}), 201


@project_bp.route("/complete-project/<int:project_id>", methods=["PUT"])
def complete_project(project_id):
    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    project.status = "Completed"
    db.session.commit()

    return jsonify({"message": "Project marked as completed"}), 200