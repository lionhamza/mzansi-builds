from flask import Blueprint, request, jsonify
from app.models.project import Project, db

project_bp = Blueprint("project", __name__)

@project_bp.route("/create-project", methods=["POST"])
def create_project():
    data = request.get_json()
    print("DATA FROM REACT:", data)  # ← add this

    new_project = Project(
        title=data.get("title"),
        description=data.get("description"),
        tech_stack=data.get("tech_stack"),
        github_link=data.get("github_link"),
        user_id=data.get("user_id"),  # ← THIS IS THE CRITICAL LINE
    )

    db.session.add(new_project)
    db.session.commit()

    return jsonify({"message": "Project created successfully!"}), 201

@project_bp.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()
    return jsonify([p.to_dict() for p in projects])