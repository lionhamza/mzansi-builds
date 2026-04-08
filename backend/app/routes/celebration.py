from flask import Blueprint, jsonify
from app.models.project import Project

celebration_bp = Blueprint("celebration", __name__)

@celebration_bp.route("/celebration-wall", methods=["GET"])
def celebration_wall():
    completed = (
        Project.query
        .filter_by(status="Completed")
        .order_by(Project.created_at.desc())
        .all()
    )

    data = []
    for p in completed:
        # 🛡️ safety: skip corrupted rows
        if not p.user:
            continue

        data.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack,
            "created_at": p.created_at.isoformat(),
            "user": {
                "full_name": p.user.full_name,
                "profile_image": p.user.profile_image
            }
        })

    return jsonify(data), 200