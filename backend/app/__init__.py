from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__, static_folder=None)
    app.config['JWT_SECRET_KEY'] = 'replace-this-with-a-strong-secret'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600

    CORS(app, supports_credentials=True)
    jwt = JWTManager(app)

    from .routes import bp
    app.register_blueprint(bp, url_prefix='/api/v1')

    return app
