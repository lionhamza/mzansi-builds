# models/collaboration.py
from app.extensions import db
from datetime import datetime

class CollaborationRequest(db.Model):
    __tablename__ = "collaboration_requests"

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    requester_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    status = db.Column(db.String(20), default="pending")  # pending, accepted, declined
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    project = db.relationship("Project")
    requester = db.relationship("User", foreign_keys=[requester_id])
    owner = db.relationship("User", foreign_keys=[owner_id])