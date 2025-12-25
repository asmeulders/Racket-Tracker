from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.exc import OperationalError

from db import db
from models import User, Racket, Order, String, StrungWith, Owns

from datetime import date

app = Flask(__name__)

# --- Database Configuration ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///store.db'
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
            db.session.commit()
            
        if not Racket.query.first():
            db.session.add(Racket(name="Pro Staff", price=300))
            db.session.add(Racket(name="Head Speed", price=315))
            db.session.commit()

        if not Order.query.first():
            db.session.add(Order(
                ordered_on=date(2025, 12, 25), 
                due_on=date(2025, 12, 27), 
                price=100, 
                racket_id=1,
                user_id=1
            ))
            db.session.add(Order(
                ordered_on=date(2025, 11, 25), 
                due_on=date(2025, 11, 27), 
                price=120, 
                racket_id=2,
                user_id=2
            ))
            db.session.commit()
            

        if not String.query.first():
            db.session.add(String(name="ALU Power", price_per_racket=22))
            db.session.add(String(name="Solinco Hyper G", price_per_racket=20))
            db.session.commit()

        if not StrungWith.query.first():
            db.session.add(StrungWith(order_id=1, string_id=1, tension=50))
            db.session.add(StrungWith(order_id=2, string_id=2, tension=52, direction="mains"))
            db.session.add(StrungWith(order_id=2, string_id=1, tension=50, direction="crosses"))
            db.session.commit()

        if not Owns.query.first():
            db.session.add(Owns(user_id=1, racket_id=1))
            db.session.add(Owns(user_id=2, racket_id=2))
            db.session.commit()
        
    return jsonify({"message": "Database initialized!"})

@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_json() for user in users])
    except OperationalError:
        return jsonify([])

@app.route('/rackets', methods=['GET'])
def get_rackets():
    try:
        rackets = Racket.query.all()
        return jsonify([r.to_json() for r in rackets])
    except OperationalError:
        return jsonify([])
    
@app.route('/strings', methods=['GET'])
def get_strings():
    try:
        strings = String.query.all()
        return jsonify([s.to_json() for s in strings])
    except OperationalError:
        return jsonify([])

@app.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        return jsonify([order.to_json() for order in orders])
    except OperationalError:
        return jsonify([])
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)