from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(200))
    email = db.Column(db.String(200), unique=True)
    password = db.Column(db.String(200))

    # ✅ DEFAULT IMAGE HERE
    profile_image = db.Column(
        db.String(500),
        default="/static/profile_images/default.png"
    )

    # relationships
    projects = db.relationship(
        "Project",
        back_populates="user",
        cascade="all, delete"
    )

    posts = db.relationship(
        "Post",
        back_populates="user",
        cascade="all, delete"
    )

    comments = db.relationship(
        "Comment",
        back_populates="user",
        cascade="all, delete-orphan"
    )