from app.extensions import db
from datetime import datetime

class ProjectMessage(db.Model):
    __tablename__ = "project_messages"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User")