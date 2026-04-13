from flask import Flask
from flask_cors import CORS
from app.extensions import db

from app.routes.auth_routes import auth_bp
from app.routes.project import project_bp
from app.routes.feed import feed_bp
from app.routes.celebration import celebration_bp
from app.routes.user_routes import user_bp


def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = "dev"

    # ✅ REQUIRED for React (localhost → localhost)
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = False

    CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://127.0.0.1:5173",
        
    ],
)

    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:password@localhost:5432/mzansi-db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5MB limit
    db.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(project_bp)
    app.register_blueprint(feed_bp)
    app.register_blueprint(celebration_bp)
    app.register_blueprint(user_bp)

    with app.app_context():
        db.create_all()

    return app