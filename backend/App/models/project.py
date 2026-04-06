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

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "tech_stack": self.tech_stack,
            "status": self.status,
            "created_at": self.created_at,
            "user_id": self.user_id,
        }