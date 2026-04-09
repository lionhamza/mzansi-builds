from app.extensions import db
from datetime import datetime

class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    tech_stack = db.Column(db.String(200))
    status = db.Column(db.String(50), default="In Progress")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    github_link = db.Column(db.String(300))

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # relationships
    user = db.relationship("User", back_populates="projects")
    posts = db.relationship("Post", back_populates="project", cascade="all, delete")