from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import time

bp = Blueprint('api', __name__)

USERS = {
    "alice": {"password": "password123"},
    "bob": {"password": "hunter2"}
}

ANNOTATIONS = []

def _mock_gallery():
    images = [
{
    "id": "we-1",
    "thumb": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=80&auto=format&fit=crop"
},
{
    "id": "we-2",
    "thumb": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=80&auto=format&fit=crop"
},
{
    "id": "we-3",
    "thumb": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1600&q=80&auto=format&fit=crop"
},
{
    "id": "we-4",
    "thumb": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&q=80&auto=format&fit=crop"
},
{
    "id": "we-5",
    "thumb": "https://images.unsplash.com/photo-1503342452485-86b7a0f6b5f2?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1503342452485-86b7a0f6b5f2?w=1600&q=80&auto=format&fit=crop"
},
{
    "id": "we-6",
    "thumb": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80&auto=format&fit=crop"
},
{
    "id": "we-7",
    "thumb": "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=1600&q=80&auto=format&fit=crop"
},
{
    "id": "we-8",
    "thumb": "https://images.unsplash.com/photo-1514996937319-344454492b37?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1514996937319-344454492b37?w=1600&q=80&auto=format&fit=crop"
},
{
    "id": "we-9",
    "thumb": "https://images.unsplash.com/photo-1485217988980-11786ced9454?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1485217988980-11786ced9454?w=1600&q=80&auto=format&fit=crop"
},
{
    "id": "we-10",
    "thumb": "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=800&q=60&auto=format&fit=crop",
    "full": "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=1600&q=80&auto=format&fit=crop"
}
]
    return images

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"msg": "username and password required"}), 400

    u = USERS.get(username)
    if not u or u.get('password') != password:
        return jsonify({"msg": "invalid credentials"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

@bp.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    identity = get_jwt_identity()
    return jsonify({"ok": True, "user": identity}), 200

@bp.route('/gallery', methods=['GET'])
@jwt_required()
def gallery():
    return jsonify(_mock_gallery()), 200

@bp.route('/annotate', methods=['POST'])
@jwt_required()
def annotate():
    payload = request.get_json() or {}
    image_id = payload.get('imageId')
    coords = payload.get('coords')
    label = payload.get('label')
    user = get_jwt_identity()
    if not image_id or not coords or not label:
        return jsonify({"msg": "missing fields"}), 400

    ANNOTATIONS.append({
        "id": f"ann-{int(time.time()*1000)}",
        "imageId": image_id,
        "coords": coords,
        "label": label,
        "user": user,
        "ts": int(time.time())
    })
    return jsonify({"ok": True}), 201

@bp.route('/annotations', methods=['GET'])
@jwt_required()
def get_annotations():
    return jsonify(ANNOTATIONS), 200
