from app.extensions import db
from datetime import datetime


class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # relationships
    post = db.relationship("Post", back_populates="comments")
    user = db.relationship("User", back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "created_at": self.created_at.isoformat(),
            "user": {
                "id": self.user.id,
                "full_name": self.user.full_name,
                "profile_image": self.user.profile_image,
            }
        }