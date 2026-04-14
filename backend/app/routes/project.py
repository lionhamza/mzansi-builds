from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.project import Project
from app.models.post import Post
from app.models.collaborationrequest import CollaborationRequest
from app.models.comment import Comment
from app.models.ProjectMessage import ProjectMessage

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



@project_bp.route("/comments/<int:post_id>")
def get_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.desc()).all()
    return jsonify([c.to_dict() for c in comments])


@project_bp.route("/add-comment", methods=["POST"])
def add_comment():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    post_id = data.get("post_id")
    message = data.get("message")

    if not message:
        return jsonify({"error": "Empty comment"}), 400

    new_comment = Comment(
        post_id=post_id,
        user_id=user_id,
        message=message
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify({
        "id": new_comment.id,
        "message": new_comment.message,
        "user": {
            "full_name": new_comment.user.full_name,
            "profile_image": new_comment.user.profile_image,
        }
    }), 201

@project_bp.route("/projects-filter/<int:user_id>")
def projects_filter(user_id):
    # My own projects
    my_projects = Project.query.filter_by(user_id=user_id).all()

    # Projects where I am accepted collaborator
    collabs = CollaborationRequest.query.filter_by(
        requester_id=user_id,
        status="accepted"
    ).all()

    collab_projects = [c.project for c in collabs]

    def serialize(p):
        return {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack,
            "status": p.status,
            "created_at": p.created_at.isoformat(),
            "github_link": p.github_link,
        }

    return jsonify({
        "mine": [serialize(p) for p in my_projects],
        "collaborating": [serialize(p) for p in collab_projects],
    })

# ================== PROJECT GROUP CHAT ==================

def user_is_in_project(project_id, user_id):
    project = Project.query.get(project_id)

    # Owner
    if project.user_id == user_id:
        return True

    # Accepted collaborator
    collab = CollaborationRequest.query.filter_by(
        project_id=project_id,
        requester_id=user_id,
        status="accepted"
    ).first()

    return collab is not None


@project_bp.route("/project-chat-allowed/<int:project_id>/<int:user_id>")
def project_chat_allowed(project_id, user_id):
    accepted = CollaborationRequest.query.filter_by(
        project_id=project_id,
        status="accepted"
    ).count()

    team_size = 1 + accepted  # owner + collaborators

    allowed = team_size >= 2 and user_is_in_project(project_id, user_id)

    return jsonify({"allowed": allowed})


@project_bp.route("/project-chat/<int:project_id>/<int:user_id>")
def get_project_chat(project_id, user_id):
    if not user_is_in_project(project_id, user_id):
        return jsonify({"error": "Not allowed"}), 403

    messages = ProjectMessage.query.filter_by(
        project_id=project_id
    ).order_by(ProjectMessage.created_at.asc()).all()

    return jsonify([
        {
            "id": m.id,
            "message": m.message,
            "created_at": m.created_at.isoformat(),
            "user": {
                "id": m.user.id,                 # ✅ ADD THIS LINE
                "name": m.user.full_name,
                "image": m.user.profile_image
            }
        }
        for m in messages
    ])

@project_bp.route("/send-project-message", methods=["POST"])
def send_project_message():
    data = request.get_json()

    project_id = data["project_id"]
    user_id = data["user_id"]
    message = data["message"]

    if not user_is_in_project(project_id, user_id):
        return jsonify({"error": "Not allowed"}), 403

    msg = ProjectMessage(
        project_id=project_id,
        user_id=user_id,
        message=message
    )

    db.session.add(msg)
    db.session.commit()

    return jsonify({"message": "sent"}), 201