import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from app.extensions import db
from app.routes.auth_routes import auth_bp
from app.routes.project import project_bp
from app.routes.feed import feed_bp
from app.routes.celebration import celebration_bp
from app.routes.user_routes import user_bp

load_dotenv()  # ← loads .env

def create_app():
    app = Flask(__name__)

    # 🔐 Secrets from .env
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    # React ↔ Flask sessions
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = False

    CORS(
        app,
        supports_credentials=True,
        origins=[
            "http://127.0.0.1:5173",
            "http://localhost:5173",
        ],
    )

    # 🗄️ Database from .env
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

    db.init_app(app)

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(project_bp)
    app.register_blueprint(feed_bp)
    app.register_blueprint(celebration_bp)
    app.register_blueprint(user_bp)

    with app.app_context():
        db.create_all()

    return app