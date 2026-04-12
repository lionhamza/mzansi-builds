from app.extensions import db
from datetime import datetime


class ProjectStar(db.Model):
    __tablename__ = "project_stars"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("project_id", "user_id", name="unique_star"),
    )