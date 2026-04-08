from app.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(200))
    email = db.Column(db.String(200), unique=True)
    password = db.Column(db.String(200))
    profile_image = db.Column(db.String(500))

    # ✅ THIS IS THE ONLY RELATIONSHIP
    projects = db.relationship("Project", backref="user", lazy=True)