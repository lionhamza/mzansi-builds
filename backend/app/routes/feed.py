from flask import Blueprint, jsonify
from app.models.post import Post

feed_bp = Blueprint("feed", __name__)

@feed_bp.route("/feed", methods=["GET"])
def get_feed():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([post.to_dict() for post in posts]), 200