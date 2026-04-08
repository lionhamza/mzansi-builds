from flask import Flask
from flask_cors import CORS
from app.extensions import db

from app.routes.auth_routes import auth_bp
from app.routes.project import project_bp
from app.routes.feed import feed_bp
from app.routes.celebration import celebration_bp  # ✅ ADD THIS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:password@localhost:5432/mzansi-db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(project_bp)
app.register_blueprint(feed_bp)
app.register_blueprint(celebration_bp)  # ✅ ADD THIS

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return {"message": "MzansiBuilds API is running"}

if __name__ == "__main__":
    app.run(debug=True)