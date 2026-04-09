from app.extensions import db
from datetime import datetime

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    post_type = db.Column(db.String(20), default="progress_update")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)

    # relationships
    user = db.relationship("User", back_populates="posts")
    project = db.relationship("Project", back_populates="posts")

    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "post_type": self.post_type,
            "created_at": self.created_at.isoformat(),
            "user": {
                "id": self.user.id,
                "full_name": self.user.full_name,
                "profile_image": self.user.profile_image,
            },
            "project": {
                "id": self.project.id,
                "title": self.project.title,
                "tech_stack": self.project.tech_stack,
                "status": self.project.status,
                "github_link": self.project.github_link,
            }
        }