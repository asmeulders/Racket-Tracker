from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.exc import OperationalError

from db import db

from models.user_model import User
from models.racket_model import Racket


app = Flask(__name__)

# --- Database Configuration ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

app.config['SQLALCHEMY_BINDS'] = {
    'rackets_db': 'sqlite:///rackets.db'
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

CORS(app)

# --- Routes ---

# Create DBs and seed data if empty (For testing)
@app.route('/init_db', methods=['POST'])
def init_db():
    with app.app_context():
        db.create_all() # Creates tables in both databases
        
        # Seed only if empty
        if not User.query.first():
            db.session.add(User(username="Alice"))
            db.session.add(User(username="Bob"))
            
        if not Racket.query.first():
            db.session.add(Racket(name="Laptop", price=999.99))
            db.session.add(Racket(name="Mouse", price=25.50))
            
        db.session.commit()
    return jsonify({"message": "Databases initialized!"})

@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_json() for user in users])
    except OperationalError:
        # If the table doesn't exist, just return an empty list
        # instead of crashing the server.
        return jsonify([])

@app.route('/rackets', methods=['GET'])
def get_rackets():
    try:
        rackets = Racket.query.all()
        return jsonify([p.to_json() for p in rackets])
    except OperationalError:
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True, port=5000)