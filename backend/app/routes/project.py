from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.project import Project
from app.models.post import Post
from app.models.collaborationrequest import CollaborationRequest
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

    post_type = data.get("type")

    # ✅ enforce only two values
    if post_type not in ["progress", "help"]:
        post_type = "progress"

    post = Post(
        message=data.get("message"),
        post_type=post_type,
        user_id=data.get("user_id"),
        project_id=data.get("project_id")
    )

    db.session.add(post)
    db.session.commit()

    return jsonify(post.to_dict()), 201


@project_bp.route("/complete-project/<int:project_id>", methods=["PUT"])
def complete_project(project_id):
    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    project.status = "Completed"
    db.session.commit()

    return jsonify({"message": "Project marked as completed"}), 200



@project_bp.route("/update-project/<int:project_id>", methods=["PUT"])
def update_project(project_id):
    data = request.get_json()

    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    project.title = data.get("title", project.title)
    project.description = data.get("description", project.description)
    project.tech_stack = data.get("tech_stack", project.tech_stack)
    project.github_link = data.get("github_link", project.github_link)

    db.session.commit()

    return jsonify({"message": "Project updated successfully"}), 200


@project_bp.route("/request-collaboration", methods=["POST"])
def request_collaboration():
    data = request.get_json()
    project_id = data["project_id"]
    requester_id = data["requester_id"]

    project = Project.query.get_or_404(project_id)

    if project.user_id == requester_id:
        return jsonify({"error": "You cannot collaborate on your own project"}), 400

    existing = CollaborationRequest.query.filter_by(
        project_id=project_id,
        requester_id=requester_id
    ).first()

    if existing:
        return jsonify({"error": "Already collaborating"}), 400

    collab = CollaborationRequest(
        project_id=project_id,
        requester_id=requester_id,
        owner_id=project.user_id,
    )

    db.session.add(collab)
    db.session.commit()

    return jsonify({"message": "Request sent"}), 201

@project_bp.route("/my-collab-notifications/<int:user_id>")
def my_collab_notifications(user_id):
    requests = CollaborationRequest.query.filter_by(
        owner_id=user_id,
        status="pending"
    ).all()

    return jsonify([
        {
            "id": r.id,
            "project_title": r.project.title,
            "requester_name": r.requester.full_name,
            "requester_image": r.requester.profile_image,
        }
        for r in requests
    ])



@project_bp.route("/collab-action/<int:req_id>", methods=["POST"])
def collab_action(req_id):
    data = request.get_json()
    action = data.get("action")

    req = CollaborationRequest.query.get_or_404(req_id)

    if action == "accept":
        req.status = "accepted"
    elif action == "decline":
        req.status = "declined"

    db.session.commit()
    return jsonify({"message": "Done"})

@project_bp.route("/collab-status/<int:project_id>/<int:user_id>")
def collab_status(project_id, user_id):
    existing = CollaborationRequest.query.filter_by(
        project_id=project_id,
        requester_id=user_id,
        status="pending"
    ).first()

    if existing:
        return jsonify({"requested": True, "request_id": existing.id})

    return jsonify({"requested": False})

@project_bp.route("/remove-collaboration", methods=["DELETE"])
def remove_collaboration():
    data = request.get_json()

    project_id = data["project_id"]
    requester_id = data["requester_id"]

    collab = CollaborationRequest.query.filter_by(
        project_id=project_id,
        requester_id=requester_id
    ).first()

    if not collab:
        return jsonify({"error": "Request not found"}), 404

    db.session.delete(collab)
    db.session.commit()

    return jsonify({"message": "Collaboration removed"}), 200

from app.models.projectstar import ProjectStar


@project_bp.route("/toggle-star", methods=["POST"])
def toggle_star():
    data = request.get_json()

    project_id = data["project_id"]
    user_id = data["user_id"]

    existing = ProjectStar.query.filter_by(
        project_id=project_id,
        user_id=user_id
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()

        star_count = ProjectStar.query.filter_by(project_id=project_id).count()

        return jsonify({
            "starred": False,
            "star_count": star_count
        }), 200

    new_star = ProjectStar(
        project_id=project_id,
        user_id=user_id
    )

    db.session.add(new_star)
    db.session.commit()

    star_count = ProjectStar.query.filter_by(project_id=project_id).count()

    return jsonify({
        "starred": True,
        "star_count": star_count
    }), 201

@project_bp.route("/star-status/<int:project_id>/<int:user_id>")
def star_status(project_id, user_id):
    existing = ProjectStar.query.filter_by(
        project_id=project_id,
        user_id=user_id
    ).first()

    star_count = ProjectStar.query.filter_by(
        project_id=project_id
    ).count()

    return jsonify({
        "starred": existing is not None,
        "star_count": star_count
    })