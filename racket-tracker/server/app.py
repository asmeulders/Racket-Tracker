from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.exc import OperationalError, IntegrityError
from datetime import datetime, timedelta

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
                orderDate=date(2025, 12, 25), 
                due=date(2025, 12, 27), 
                price=100, 
                complete=False,
                racket_id=1,
                user_id=1
            ))
            db.session.add(Order(
                orderDate=date(2025, 11, 25), 
                due=date(2025, 11, 27), 
                price=120, 
                complete=False,
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
    
@app.route('/get-racket-by-id/<int:racket_id>', methods=['GET'])
def get_racket_by_id(racket_id: int):
    """    
    :param racket_id: id of the racket
    :type racket_id: int
    :returns racket: json object
    """
    racket = db.session.execute(db.select(Racket).filter_by(id=racket_id)).scalar_one_or_none()
    if racket: 
        return jsonify(racket.to_json())
    return jsonify({"error": "Racket not found"}), 404

@app.route('/create-racket', methods=['POST'])
def create_racket():
    """    
    Create a racket from a user form input
    """
    data = request.get_json()

    if not data or "name" not in data or "price" not in data:
        return jsonify({"error": "Missing required fields 'name', 'price' or 'data'"}), 400
    
    name = data.get('name')
    price = data.get('price')

    existing_racket = db.session.execute(db.select(Racket).filter_by(name=name, price=price)).first()
    if existing_racket:
        return jsonify({"error": "This racket already exists"}), 409

    try:
        racket = Racket(name=name, price=price)
        db.session.add(racket)
        db.session.commit()

        return jsonify({"message": "Racket successfully created", "racket": racket}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
    
@app.route('/strings', methods=['GET'])
def get_strings():
    try:
        strings = String.query.all()
        return jsonify([s.to_json() for s in strings])
    except OperationalError:
        return jsonify([])
    
@app.route('/create-string', methods=['POST'])
def create_string():
    """    
    Create a string from a user form input
    """
    data = request.get_json()

    if not data or "name" not in data or "price_per_racket" not in data:
        return jsonify({"error": "Missing required fields 'name', 'price_per_racket', or 'data'"}), 400
    
    name = data.get('name')
    price_per_racket = data.get('price_per_racket')

    existing_string = db.session.execute(db.select(String).filter_by(name=name, price_per_racket=price_per_racket)).first()
    if existing_string:
        return jsonify({"error": "This string already exists"}), 409

    try:
        string = String(name=name, price_per_racket=price_per_racket)
        db.session.add(string)
        db.session.commit()

        return jsonify({"message": "String successfully created", "string": string.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

@app.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        return jsonify([order.to_json() for order in orders])
    except OperationalError:
        return jsonify([])

@app.route('/create-order', methods=['POST'])
def create_order():
    """    
    Create an order from a user form input.
    Need to get date and set the due date then set price
    """
    data = request.get_json()

    if not data or "racket_id" not in data or "user_id" not in data or "string_id" not in data or "tension" not in data:
        return jsonify({"error": "Missing required fields 'racket_id', 'user_id', 'string_id', or 'tension'"}), 400
    
    if "crosses_id" not in data and 'crossesTension' in data or "crosses_id" in data and 'crossesTension' not in data:
        return jsonify({"error": "Missing required fields 'crosses_id' or 'crossesTension'"}), 400
    
    racket_id = data.get('racket_id')
    user_id = data.get('user_id')
    string_id = data.get('string_id')
    tension = data.get('tension')
    crosses_id = data.get('crosses_id')
    crossesTension = data.get('crossesTension')

    # dates
    orderDate = date.today()
    four_days_later = date.today() + timedelta(days=4)

    try:
        # price of strings
        mains = db.session.execute(db.select(String).filter_by(id=string_id)).scalar_one()
        if not crosses_id and not crossesTension or crosses_id == string_id and crossesTension == tension:
            price = 25 + mains.price_per_racket

            order = Order(orderDate=orderDate, due=four_days_later, price=price, complete=False, racket_id=racket_id, user_id=user_id)
            
            racketStrungWith = StrungWith(tension=tension, direction=None, strings=mains)
            order.strung_with_records.append(racketStrungWith)
            
            db.session.add(order)
            db.session.commit()
        else:
            crosses = db.session.execute(db.select(String).filter_by(id=crosses_id)).scalar_one()

            price = 25 + (mains.price_per_racket + crosses.price_per_racket)/2

            order = Order(orderDate=orderDate, due=four_days_later, price=price, complete=False, racket_id=racket_id, user_id=user_id)

            mainsStrungWith = StrungWith(tension=tension, direction="mains", strings=mains)
            crossesStrungWith = StrungWith(tension=crossesTension, direction="crosses", strings=crosses)

            order.strung_with_records.extend([mainsStrungWith, crossesStrungWith])
            db.session.add(order)
            db.session.commit()

        return jsonify({"message": "Order successfully created", "order": order.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    

@app.route('/complete-order', methods=['PATCH'])
def complete_order():
    """
    Completes an order
    """
    data = request.get_json()

    if not data or not "order_id" in data:
        return jsonify({"error": "Missing required field 'order_id'"}), 400
    
    order_id = data.get('order_id')

    try:
        order = db.session.execute(db.select(Order).filter_by(id=order_id)).scalar_one()
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        if order.complete:
            return jsonify({
                "message": "Order was already completed", 
                "order": order.to_json() 
            }), 200
        
        order.complete = True

        db.session.add(order)
        db.session.commit()

        return jsonify({"message": "Order successfully completed", "order": order.to_json()}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5000)