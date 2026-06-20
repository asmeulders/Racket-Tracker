from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.exc import OperationalError, IntegrityError, SQLAlchemyError
from datetime import datetime, timedelta

from db import db
from models import User, Racket, Order, String, StrungWith, Owns, Brand, Inquiry

from datetime import date

app = Flask(__name__)

# --- Database Configuration ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///store.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

CORS(app)

MODEL_MAP = {
    "brands": Brand,
    "rackets": Racket,
    "strings": String,
    "users": User,
    "inquiries": Inquiry,
    "orders": Order
}

# =======================================================================================================================
# ----------------------------Databse Funcitons--------------------------------------------------------------------------
# =======================================================================================================================

def _seed_db():
    """
    Generates basic data to test database interactions and front end
    """
    db.create_all()
    
    if not User.query.first():
        db.session.add(User(username="a1", firstName='Alice', lastName='Marble', phone=None, email='a1@gmail.com'))
        db.session.add(User(username="b2", firstName='Boris', lastName='Becker', phone='1231231234', email='b2@aol.com'))
        db.session.commit()
    
    alice = db.session.execute(db.select(User).filter_by(username="a1")).scalar_one()
    bob = db.session.execute(db.select(User).filter_by(username="b2")).scalar_one()

    if not Brand.query.first():
        db.session.add(Brand(name='Solinco'))
        db.session.add(Brand(name='Luxilon'))
        db.session.add(Brand(name='Wilson'))
        db.session.add(Brand(name='Head'))
        db.session.commit()

    wilson = db.session.execute(db.select(Brand).filter_by(name="Wilson")).scalar_one()
    solinco = db.session.execute(db.select(Brand).filter_by(name="Solinco")).scalar_one()
    luxilon = db.session.execute(db.select(Brand).filter_by(name="Luxilon")).scalar_one()
    head = db.session.execute(db.select(Brand).filter_by(name="Head")).scalar_one()
        
    if not Racket.query.first():
        db.session.add(Racket(name="Pro Staff", price=300, brand=wilson))
        db.session.add(Racket(name="Speed", price=315, brand=head))
        db.session.commit()

    prostaff = db.session.execute(db.select(Racket).filter_by(name="Pro Staff")).scalar_one()
    speed = db.session.execute(db.select(Racket).filter_by(name="Speed")).scalar_one()

    if not Order.query.first():
        db.session.add(Order(
            orderDate=date(2025, 12, 25), 
            due=date(2025, 12, 27), 
            price=100, 
            complete=False,
            paid=False,
            racket=prostaff,
            user=alice
        ))
        db.session.add(Order(
            orderDate=date(2025, 11, 25), 
            due=date(2025, 11, 27), 
            price=120, 
            complete=False,
            paid=True,
            racket=speed,
            user=bob
        ))
        db.session.commit()

    order1 = db.session.execute(db.select(Order).filter_by(user=alice)).scalar_one()
    order2 = db.session.execute(db.select(Order).filter_by(user=bob)).scalar_one()

    if not String.query.first():
        db.session.add(String(name="ALU Power", pricePerRacket=22, brand=luxilon))
        db.session.add(String(name="Hyper G", pricePerRacket=20, brand=solinco))
        db.session.commit()

    aluPower = db.session.execute(db.select(String).filter_by(name="ALU Power")).scalar_one()
    hyperG = db.session.execute(db.select(String).filter_by(name="Hyper G")).scalar_one()

    if not StrungWith.query.first():
        db.session.add(StrungWith(order=order1, string=aluPower, tension=50))
        db.session.add(StrungWith(order=order2, string=hyperG, tension=52, direction="mains"))
        db.session.add(StrungWith(order=order2, string=aluPower, tension=50, direction="crosses"))
        db.session.commit()

    if not Owns.query.first():
        db.session.add(Owns(user=alice, racket=prostaff, quantity=1))
        db.session.add(Owns(user=bob, racket=speed, quantity=1))
        db.session.commit()  

    if not Inquiry.query.first():
        inquiryDate = date.today()
        db.session.add(Inquiry(name="Alex", email="example@ex.com", phone="5555555555", message='hello', date=inquiryDate)) 
        db.session.commit()     

def init_db():
    with app.app_context():
        db.create_all()

# =======================================================================================================================
# ----------------------------General Routes-----------------------------------------------------------------------------
# =======================================================================================================================


@app.route('/api/seed_db', methods=['POST'])
def seed_db_route():
    _seed_db()
    return jsonify({"message": "Database initialized!"})    
    

@app.route('/api/toggle-complete/<int:orderId>', methods=['PATCH'])
def toggle_complete(orderId: int):
    """
    Marks and order as completed/uncompleted. Is toggled from the store dashboard.
    """
    try:
        order = db.session.get(Order, orderId)
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        order.complete = not order.complete

        db.session.add(order)
        db.session.commit()

        return jsonify({"message": "Order complete field successfully toggled", "order": order.to_json()}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    

@app.route('/api/pay-for-order/<int:orderId>', methods=['PATCH'])
def pay_for_order(orderId: int):
    """
    Marks and order as paid/unpaid. Is toggled from the store dashboard.
    """    
    try:
        order = db.session.get(Order, orderId)
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        order.paid = not order.paid

        db.session.add(order)
        db.session.commit()

        return jsonify({"message": "Order toggled paying for an order", "order": order.to_json()}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
    

def list_orders():
    """
    Fetches orders from the database
    """
    query = db.select(Order).order_by(Order.due.desc())        
    try:
        orders = db.session.execute(query).scalars().all()
        return jsonify([order.to_json() for order in orders]), 200
    except OperationalError as e:
        app.logger.error(f"DB error fetching orders: {e}")
        return jsonify({"error": "Database unavailable"}), 500

def list_rackets():
    """
    Fetches rackets from the database
    """
    query = db.select(Racket).order_by(Racket.name.asc())
    try:
        rackets = db.session.execute(query).scalars().all()
        return jsonify([r.to_json() for r in rackets]), 200
    except OperationalError as e:
        app.logger.error(f"DB error fetching rackets: {e}")
        return jsonify({"error": "Database unavailable"}), 500

def list_strings():
    """
    Fetches strings from the database
    """
    query = db.select(String).order_by(String.name.asc())
    try:
        strings = db.session.execute(query).scalars().all()
        return jsonify([s.to_json() for s in strings]), 200
    except OperationalError as e:
        app.logger.error(f"DB error fetching strings: {e}")
        return jsonify({"error": "Database unavailable"}), 500

def list_users():
    """
    Gets users from the database
    """
    query = db.select(User).order_by(User.username.asc())
    try:
        users = db.session.execute(query).scalars().all()
        return jsonify([user.to_json() for user in users]), 200
    except OperationalError as e:
        app.logger.error(f"DB error fetching users: {e}")
        return jsonify({"error": "Database unavailable"}), 500

def list_brands():
    """
    Fetches brands from the database
    """
    query = db.select(Brand).order_by(Brand.name.asc())        
    try:
        brands = db.session.execute(query).scalars().all()
        return jsonify([b.to_json() for b in brands]), 200
    except OperationalError as e:
        app.logger.error(f"DB error fetching brands: {e}")
        return jsonify({"error": "Database unavailable"}), 500

def list_inquiries():
    """
    Fetches inquiries from the database
    """
    query = db.select(Inquiry).order_by(Inquiry.name.asc())
    try:
        inquiries = db.session.execute(query).scalars().all()
        return jsonify([b.to_json() for b in inquiries]), 200
    except OperationalError as e:
        app.logger.error(f"DB error fetching inquiries: {e}")
        return jsonify({"error": "Database unavailable"}), 500

LIST_HANDLERS = {
    'orders': list_orders,
    'rackets': list_rackets,
    'strings': list_strings,
    'users': list_users,
    'brands': list_brands,
    'inquiries': list_inquiries
}

def get_order(orderId: int):
    """    
    Fetches a single racket from the database by its id

    Parameter:
        - racketId (int): identifies the racket
    """
    try:
        order = db.session.get(Order, orderId)
    except OperationalError as e:
        app.logger.error(f"DB error fetching order {orderId}: {e}")
        return jsonify({"error": "Database unavailable"}), 500
    
    if order: 
        return jsonify(order.to_json()), 200
    return jsonify({"error": "Racket not found"}), 404

def get_racket(racketId: int):
    """    
    Fetches a single racket from the database by its id

    Parameter:
        - racketId (int): identifies the racket
    """
    try:
        racket = db.session.get(Racket, racketId)
    except OperationalError as e:
        app.logger.error(f"DB error fetching racket {racketId}: {e}")
        return jsonify({"error": "Database unavailable"}), 500
    
    if racket: 
        return jsonify(racket.to_json()), 200
    return jsonify({"error": "Racket not found"}), 404

def get_string(stringId: int):
    """    
    Fetches a single string from the database by its id.

    Parameter:
        - stringId (int): identifies the string
    """
    try:
        string = db.session.get(String, stringId)
    except OperationalError as e:
        app.logger.error(f"DB error fetching string {stringId}: {e}")
        return jsonify({"error": "Database unavailable"}), 500
    
    if string: 
        return jsonify(string.to_json()), 200
    return jsonify({"error": "String not found"}), 404


def get_user(userId: int):
    """    
    Fetches a user from the database by its id.

    Parameter:
        - userId (int): identifies the user
    """
    try:
        user = db.session.get(User, userId)
    except OperationalError as e:
        app.logger.error(f"DB error fetching user {userId}: {e}")
        return jsonify({"error": "Database unavailable"}), 500
    
    if user: 
        return jsonify(user.to_json()), 200
    return jsonify({"error": "User not found"}), 404

def get_brand(brandId: int):
    """    
    Fetches a brand from the database by its id.

    Parameter:
        - brandId (int): identifies the brand
    """
    try:
        brand = db.session.get(Brand, brandId)
    except OperationalError as e:
        app.logger.error(f"DB error fetching brand {brandId}: {e}")
        return jsonify({"error": "Database unavailable"}), 500
    
    if brand: 
        return jsonify(brand.to_json()), 200
    return jsonify({"error": "Brand not found"}), 404

def get_inquiry(inquiryId: int):
    """    
    Fetches an inquiry from the database by its id.

    Parameter:
        - inquiryId (int): identifies the inquiry
    """
    try:
        inquiry = db.session.get(Inquiry, inquiryId)
    except OperationalError as e:
        app.logger.error(f"DB error fetching inquiry {inquiryId}: {e}")
        return jsonify({"error": "Database unavailable"}), 500
    
    if inquiry: 
        return jsonify(inquiry.to_json()), 200
    return jsonify({"error": "Inquiry not found"}), 404



ENTRY_HANDLERS = {
    'orders': get_order,
    'rackets': get_racket,
    'strings': get_string,
    'users': get_user,
    'brands': get_brand,
    'inquiries': get_inquiry
}

# CREATE HANDLERS

def create_order(body):
    """    
    Creates an order. Automatically calculates the price based on the strings plus the default labor cost.
    The variable sameForCrosses will is false for a hybrid setup. Change the laborCost and laborDays 
    variables to adjust the final price and the due date.

    Expected JSON Format:
    {
        'userId': userId,
        'racketId': racketId,
        'mainsId': mainsId,
        'mainsTension': mainsTension,
        'crossesId': crossesId,
        'crossesTension': crossesTension,
        'sameForCrosses': sameForCrosses,
        'paid': paid
    }

    Default Labor Cost: $25 per racket -> laborCost
    Default Labor Days: 4 days per racket -> laborDays

    ================================================================================
    TODO: 
    - include logic to add the racket to their list of rackets if it does not exist?
    - keep service fee separate from strings so you can adjust more easily?
    ================================================================================
    """
    laborCost = 25
    laborDays = 4

    if "racketId" not in body or "userId" not in body or "mainsId" not in body or "mainsTension" not in body or "sameForCrosses" not in body or 'paid' not in body:
        return jsonify({"error": "Missing required fields 'racketId', 'userId', 'mainsId', 'mainsTension', 'sameForCrosses', or 'paid'"}), 400
    
    sameForCrosses = body.get('sameForCrosses')
    if not isinstance(sameForCrosses, bool):
        return jsonify({"error": "'sameForCrosses' must be a boolean"}), 400

    if not sameForCrosses:
        if "crossesId" not in body or "crossesTension" not in body:
            return jsonify({"error": "Missing required fields 'crossesId' or 'crossesTension'"}), 400
    
    racketId = body.get('racketId')
    userId = body.get('userId')
    mainsId = body.get('mainsId')
    mainsTension = body.get('mainsTension')
    try:
        mainsTension = int(mainsTension)
    except ValueError as e:
        app.logger.error(f"Invalid mainsTension input: {e}")
        return jsonify({"error": "Invalid mainsTension input"}), 400
    if not isinstance(mainsTension, int) or mainsTension < 0 or mainsTension > 100:
        app.logger.error(f"Invalid mainsTension value")
        return jsonify({"error": "mainsTension must be a non-negative number less than 100"}), 400
    
    paid = body.get('paid')

    # Dates
    orderDate = date.today()
    dueDate = date.today() + timedelta(days=laborDays)
    
    try:
        user = db.session.get(User, userId)
        if not user:
            return jsonify({"error": "User does not exist"}), 404
        
        racket = db.session.get(Racket, racketId)
        if not racket:
            return jsonify({"error": "Racket does not exist"}), 404
        
        mains = db.session.get(String, mainsId)
        if not mains:
            return jsonify({"error": "String does not exist"}), 404
        

        if not sameForCrosses:
            crossesId = body.get('crossesId')
            crossesTension = body.get('crossesTension')
            try:
                crossesTension = int(crossesTension)
            except ValueError as e:
                app.logger.error(f"Invalid crossesTension input: {e}")
                return jsonify({"error": "Invalid crossesTension input"}), 400
            if not isinstance(crossesTension, int) or crossesTension < 0 or crossesTension > 100:
                app.logger.error(f"Invalid crossesTension value")
                return jsonify({"error": "crossesTension must be a non-negative number less than 100"}), 400
            
            crosses = db.session.get(String, crossesId)
            if not crosses:
                return jsonify({"error": "String does not exist"}), 404
        
            # recompute sameForCrosses in case input error
            sameForCrosses = crosses.id == mains.id and crossesTension == mainsTension
        
        if sameForCrosses:
            # Single string setup
            price = laborCost + mains.pricePerRacket

            order = Order(orderDate=orderDate, due=dueDate, price=price, complete=False, paid=paid, racket=racket, user=user)
            
            racketStrungWith = StrungWith(tension=mainsTension, direction=None, string=mains)
            order.strungWithRecords.append(racketStrungWith)
            
            db.session.add(order)
            db.session.commit()
        else:
            # Hybrid setup
            price = laborCost + (mains.pricePerRacket + crosses.pricePerRacket)/2

            order = Order(orderDate=orderDate, due=dueDate, price=price, complete=False, paid=paid, racket=racket, user=user)

            mainsStrungWith = StrungWith(tension=mainsTension, direction="mains", string=mains)
            crossesStrungWith = StrungWith(tension=crossesTension, direction="crosses", string=crosses)

            order.strungWithRecords.extend([mainsStrungWith, crossesStrungWith])
            db.session.add(order)
            db.session.commit()

        return jsonify({"message": "Order successfully created", "order": order.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable creating order: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def create_racket(body):
    """    
    Creates a racket

    Expected JSON Format:
    {
        'name': name,
        'price': price,
        'brandId': brandId
    }
    """
    if "name" not in body or "price" not in body or "brandId" not in body:
        return jsonify({"error": "Missing required fields 'name', 'price', or 'brandId"}), 400
    
    name = body.get('name')
    price = body.get('price')
    try:
        price = float(price)
    except ValueError as e:
        app.logger.error(f"Invalid price input: {e}")
        return jsonify({"error": "Invalid price input"}), 400
    if not isinstance(price, (int, float)) or price < 0:
        app.logger.error(f"Price must be a non-negative number: {price}")
        return jsonify({"error": "Price must be a non-negative number"}), 400

    brandId = body.get('brandId') 

    try:
        # Looks for brand first  
        brand = db.session.get(Brand, brandId)
        if not brand:
            return jsonify({"error": "Brand does not exist"}), 404
        
        # Checks for an existing racket
        existingRacket = db.session.execute(db.select(Racket).filter_by(name=name)).scalar_one_or_none()
        if existingRacket:
            return jsonify({"error": "This racket already exists"}), 409
    
        racket = Racket(name=name, price=price, brand=brand)
        db.session.add(racket)
        db.session.commit()

        return jsonify({"message": "Racket successfully created", "racket": racket.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable creating racket: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"Duplicate racket: {e}")
        return jsonify({"error": "A racket with this name already exists"}), 409
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def create_string(body):
    """    
    Creates a string

    Expected JSON Format:
    {
        'name': name,
        'pricePerRacket': pricePerRacket,
        'brandId': brandId
    }
    """
    if "name" not in body or "pricePerRacket" not in body or "brandId" not in body:
        return jsonify({"error": "Missing required fields 'name', 'pricePerRacket', or 'brandId'"}), 400
    
    name = body.get('name')
    pricePerRacket = body.get('pricePerRacket')
    brandId = body.get('brandId')

    try:
        # Looks for brand
        brand = db.session.get(Brand, brandId)
        if not brand:
            return jsonify({"error": "Brand does not exist"}), 404
        
        # Checks for an existing string
        existingString = db.session.execute(db.select(String).filter_by(name=name)).scalar_one_or_none()
        if existingString:
            return jsonify({"error": "This string already exists"}), 409
    
        string = String(name=name, pricePerRacket=pricePerRacket, brand=brand)
        db.session.add(string)
        db.session.commit()

        return jsonify({"message": "String successfully created", "string": string.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable creating string: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"Duplicate string: {e}")
        return jsonify({"error": "A string with this name already exists"}), 409
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def create_user(body):
    """    
    Create a user from a user form input

    Expected JSON Format:
    {
        'username': username,
        'firstName': firstName,
        'lastName': lastName,
        'phone': phone,
        'email': email
    }
    """
    if "username" not in body or 'firstName' not in body or 'lastName' not in body or 'email' not in body:
        return jsonify({"error": "Missing required fields 'username', 'firstName', 'lastName', 'email'."}), 400
    
    username = body.get('username')
    firstName = body.get('firstName')
    lastName = body.get('lastName')
    email = body.get('email') # TODO: email validation
    phone = None
    if 'phone' in body:
        phone = body.get('phone')

    try:
        # Checks for an existing user
        existingUser = db.session.execute(db.select(User).filter_by(username=username)).scalar_one_or_none()
        if existingUser:
            return jsonify({"error": "A user with this username already exists"}), 409
        
        user = User(username=username, firstName=firstName, lastName=lastName, email=email, phone=phone)
        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User successfully created", "user": user.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable creating user: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"Duplicate user: {e}")
        return jsonify({"error": "A user with this username already exists"}), 409
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def create_brand(body):
    """    
    Creates a brand

    Expected JSON Format:
    {
        'name': name
    }
    """
    if "name" not in body:
        return jsonify({"error": "Missing required fields 'name'."}), 400
    
    name = body.get('name')

    try:
        # Checks for an existing brand
        existingBrand = db.session.execute(db.select(Brand).filter_by(name=name)).scalar_one_or_none()
        if existingBrand:
            return jsonify({"error": "This user already exists"}), 409
        
        brand = Brand(name=name)
        db.session.add(brand)
        db.session.commit()

        return jsonify({"message": "Brand successfully created", "brand": brand.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable creating brand: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"Duplicate brand: {e}")
        return jsonify({"error": "A string with this name already exists"}), 409
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def create_inquiry(body):
    """    
    Creates an inquiry

    Expected JSON Format:
    {
        'name': name,
        'phone': phone,
        'email': email,
        'message': message
    }
    """
    if "name" not in body or "email" not in body or "message" not in body:
        return jsonify({"error": "Missing required fields 'name', 'email', or 'message'"}), 400
    
    name = body.get('name')
    # TODO: phone and email validation
    phone = body.get('phone')
    email = body.get('email')
    message = body.get('message')
    inquiryDate = date.today()

    try:
        inquiry = Inquiry(name=name, phone=phone, email=email, message=message, date=inquiryDate)
        db.session.add(inquiry)
        db.session.commit()

        return jsonify({"message": "Inquiry successfully created", "inquiry": inquiry.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable creating inquiry: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

CREATE_HANDLERS = {
    'orders': create_order,
    'rackets': create_racket,
    'strings': create_string,
    'users': create_user,
    'brands': create_brand,
    'inquiries': create_inquiry
}

# UPDATE HANDLERS

def update_order(id, body):
    """    
    Updates an order.

    Expected JSON Format:
    {
        'orderId': orderId,
        'userId': userId,
        'racketId': racketId,
        'mainsId': mainsId,
        'mainsTension': mainsTension,
        'crossesId': crossesId,
        'crossesTension': crossesTension,
        'sameForCrosses': sameForCrosses,
        'orderDue': orderDue,
        'price: price
    }
    """
    if "orderId" not in body or "sameForCrosses" not in body:
        return jsonify({"error": "Missing required field 'orderId' or 'sameForCrosses'"}), 400
    
    sameForCrosses = body.get('sameForCrosses')

    if not sameForCrosses:
        if "crossesId" not in body or 'crossesTension' not in body:
            return jsonify({"error": "Missing required fields 'crossesId' or 'crossesTension'"}), 400
    
    # change to all fields being required??
    racketId = userId = mainsId = mainsTension = crossesId = crossesTension = orderDue = price = None
    if 'racketId' in body:
        racketId = body.get('racketId')
    if 'userId' in body:
        userId = body.get('userId')
    if 'mainsId' in body:
        mainsId = body.get('mainsId')
    if 'mainsTension' in body: 
        mainsTension = body.get('mainsTension')
        try:
            mainsTension = int(mainsTension)
        except ValueError as e:
            app.logger.error(f"Invalid mainsTension input: {e}")
            return jsonify({"error": "Invalid mainsTension input"}), 400
        if not isinstance(mainsTension, int) or mainsTension < 0 or mainsTension > 100:
            return jsonify({"error": "mainsTension must be a non-negative number less than 100"}), 400
    if 'crossesId' in body: 
        crossesId = body.get('crossesId')
    if 'crossesTension' in body:
        crossesTension = body.get('crossesTension')
        try:
            crossesTension = int(crossesTension)
        except ValueError as e:
            app.logger.error(f"Invalid crossesTension input: {e}")
            return jsonify({"error": "Invalid crossesTension input"}), 400
        if not isinstance(crossesTension, int) or crossesTension < 0 or crossesTension > 100:
            return jsonify({"error": "crossesTension must be a non-negative number less than 100"}), 400
    if 'orderDue' in body:
        dateString = body.get('orderDue')
        orderDue = datetime.strptime(dateString, '%Y-%m-%d').date()
    if 'price' in body:
        price = body.get('price')
        try:
            price = float(price)
        except ValueError as e:
            app.logger.error(f"Invalid price input: {e}")
            return jsonify({"error": "Invalid price input"}), 400
        if not isinstance(price, float) or price < 0:
            return jsonify({"error": "Price must be a non-negative number"}), 400

    try:
        order = db.session.get(Order, id)
        if racketId:
            racket = db.session.get(Racket, racketId)
            if racket == None:
                return jsonify({"error": "Racket does not exist"}), 404
            order.racketId = racketId
        if userId:
            user = db.session.get(User, userId)
            if user == None:
                db.session.rollback()
                return jsonify({"error": "User does not exist"}), 404
            order.userId = userId
        if sameForCrosses:
            for record in order.strungWithRecords:
                if record.direction == None or record.direction == 'mains':
                    record.direction = None
                    if mainsId:
                        string = db.session.get(String, mainsId)
                        if not string:
                            db.session.rollback()
                            return jsonify({"error": "String does not exist"}), 404
                        record.string = string
                    if mainsTension:
                        record.tension = mainsTension
                else:
                    order.strungWithRecords.remove(record)
        else:
            if len(order.strungWithRecords) == 2:

                for record in order.strungWithRecords:
                    if record.direction == None or record.direction == 'mains':
                        record.direction = 'mains'
                        if mainsId:
                            mains = db.session.get(String, mainsId)
                            if not mains:
                                db.session.rollback()
                                return jsonify({"error": "String does not exist"}), 404
                            record.string = mains
                        if mainsTension:
                            record.tension = mainsTension
                    else:
                        if crossesId:
                            crosses = db.session.get(String, crossesId)
                            if not crosses:
                                db.session.rollback()
                                return jsonify({"error": "String does not exist"}), 404
                            record.string = crosses
                        if crossesTension:
                            record.tension = crossesTension
            else:
                mainsStrungWith = order.strungWithRecords[0]
                if mainsId:
                    mains = db.session.get(String, mainsId)
                    if not mains:
                        db.session.rollback()
                        return jsonify({"error": "String does not exist"}), 404
                    mainsStrungWith.string = mains
                if mainsTension:
                    mainsStrungWith.tension = mainsTension
                
                crossesStrungWith = None
                if crossesId and crossesTension:
                    crosses = db.session.get(String, crossesId)
                    if not crosses:
                        db.session.rollback()
                        return jsonify({"error": "String does not exist"}), 404
                    crossesStrungWith = StrungWith(tension=crossesTension, direction="crosses", string=crosses)
                    order.strungWithRecords.append(crossesStrungWith)

        if orderDue:
            order.due = orderDue
        if price:
            order.price = price

        db.session.commit()
        return jsonify({"message": "Order successfully updated", "order": order.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable updating order: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def update_racket(id, body):
    """    
    Updates a racket.

    Expected JSON Format:
    {
        'racketId': racketId,
        'brandId': brandId,
        'name': name,
        'price: price
    }
    """
    if "racketId" not in body:
        return jsonify({"error": "Missing required field 'racketId'"}), 400
    
    # change to all fields being required??
    brandId = name = price = None
    if 'brandId' in body:
        brandId = body.get('brandId')
    if 'name' in body:
        name = body.get('name')
    if 'price' in body:
        price = body.get('price')
        if not isinstance(price, float) or price < 0:
            return jsonify({"error": "Price must be a non-negative number"})

    try:
        racket = db.session.get(Racket, id)
        if brandId:
            brand = db.session.get(Brand, brandId)
            if brand == None:
                db.session.rollback()
                return jsonify({"error": "Brand does not exist."}), 404
            racket.brandId = brandId
        if name:
            existingRacket = db.session.execute(db.select(Racket).filter_by(name=name)).scalar_one_or_none()
            if existingRacket:
                db.session.rollback()
                return jsonify({"error": "A racket with this name already exists"}), 409
            racket.name = name
        if price:
            racket.price = price

        db.session.commit()
        return jsonify({"message": "Racket successfully updated", "racket": racket.to_json()}), 201

    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable updating racket: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"Duplicate racket: {e}")
        return jsonify({"error": "A racket with this name already exists."}), 409
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def update_string(id, body):
    """    
    Updates a string.

    Expected JSON Format:
    {
        'stringId': stringId,
        'brandId': brandId,
        'name': name,
        'pricePerRacket': pricePerRacket
    }
    """
    if "stringId" not in body:
        return jsonify({"error": "Missing required field 'stringId'"}), 400
    
    # change to all fields being required??
    stringId = body.get('stringId')
    brandId = name = pricePerRacket = None
    if 'brandId' in body:
        brandId = body.get('brandId')
    if 'name' in body:
        name = body.get('name')
    if 'pricePerRacket' in body:
        pricePerRacket = body.get('pricePerRacket')
        if not isinstance(pricePerRacket, float) or pricePerRacket < 0:
            return jsonify({"error": "pricePerRacket must be a non-negative number."}), 400

    try:
        string = db.session.get(String, stringId)
        if brandId:
            brand = db.session.get(Brand, brandId)
            if not brand:
                db.session.rollback()
                return jsonify({"error": "Brand does not exist"}), 404
            string.brandId = brandId
        if name:
            existingString = db.session.execute(db.select(String).filter_by(name=name)).scalar_one_or_none()
            if existingString:
                db.session.rollback()
                return jsonify({"error": "There already exists a string with this name"}), 409
            string.name = name
        if pricePerRacket:
            string.pricePerRacket = pricePerRacket

        db.session.commit()
        return jsonify({"message": "String successfully updated", "string": string.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable updating string: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"Duplicate string: {e}")
        return jsonify({"error": "A string with this name already exists."}), 409
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def update_user(id, body):
    """    
    Updates a user.

    Expected JSON Format:
    {
        'userId': userId,
        'usernname': username,
        'firstName': firstName,
        'lastName: lastName,
        'phone': phone,
        'email': email
    }
    """
    if "userId" not in body:
        return jsonify({"error": "Missing required field 'userId'"}), 400
    
    # change to all fields being required??
    username = firstName = lastName = phone = email = None
    if 'username' in body:
        username = body.get('username')
    if 'firstName' in body:
        firstName = body.get('firstName')
    if 'lastName' in body:
        lastName = body.get('lastName')
    if 'phone' in body:
        phone = body.get('phone')
    if 'email' in body:
        email = body.get('email')

    try:
        user = db.session.get(User, id)
        if username:
            # validate unique
            user.username = username
        if firstName:
            user.firstName = firstName
        if lastName:
            user.lastName = lastName
        if phone: 
            if phone == "NONE":
                user.phone = ""
            else:
                user.phone = phone
        if email:
            user.email = email

        db.session.commit()
        return jsonify({"message": "User successfully updated", "user": user.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable updating user: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"Duplicate user: {e}")
        return jsonify({"error": "A user with this username already exists."}), 409
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def update_brand(id, body):
    """    
    Updates a brand.

    Expected JSON Format:
    {
        'brandId': brandId,
        'name': name
    }
    """
    # change to all fields being required??
    name = None
    if 'name' in body:
        name = body.get('name')

    try:
        brand = db.session.get(Brand, id)
        if name:
            existingBrand = db.session.execute(db.select(Brand).filter_by(name=name)).scalar_one_or_none()
            if existingBrand:
                db.session.rollback()
                return jsonify({"error": "A brand already exists with this name"}), 409
            brand.name = name
    
        db.session.commit()
        return jsonify({"message": "Brand successfully updated", "brand": brand.to_json()}), 201
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable updating brand: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"Duplicate brand: {e}")
        return jsonify({"error": "A brand with this name already exists."}), 409
    
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def update_inquiry(id, body):
    pass


UPDATE_HANDLERS = {
    'orders': update_order,
    'rackets': update_racket,
    'strings': update_string,
    'users': update_user,
    'brands': update_brand,
    'inquiries': update_inquiry
}

# DELETE HANDLERS

def delete_order(id):
    """    
    Deletes an order from the database by its id

    Parameter:
        - orderId (int): identifies the order
    """
    try:
        order = db.session.get(Order, id)
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        db.session.delete(order)
        db.session.commit()

        return jsonify({"message": "Order successfully deleted"}), 200
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable deleting order: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def delete_racket(id):
    """    
    Deletes a single racket from the database by its id

    Parameter:
        - racketId (int): identifies the racket
    """
    try:
        racket = db.session.get(Racket, id)
        if not racket:
            return jsonify({"error": "Racket not found"}), 404
        
        db.session.delete(racket)
        db.session.commit()

        return jsonify({"message": "Racket successfully deleted"}), 200
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable deleting racket: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def delete_string(id):
    """    
    Deletes a string from the database by its id

    Parameter:
        - stringId (int): identifies the string
    """
    try:
        string = db.session.get(String, id)
        if not string:
            return jsonify({"error": "String not found"}), 404
        
        db.session.delete(string)
        db.session.commit()

        return jsonify({"message": "String successfully deleted"}), 200
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable deleting string: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.info(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def delete_user(id):
    """    
    Delete a user from the database

    Parameters:
        - userId (int): identifies the user
    """
    try:
        user = db.session.get(User, id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User successfully deleted"}), 200
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable deleting user: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def delete_brand(id):
    """    
    Deletes a brand from the database by its id

    Parameter:
        - brandId (int): identifies the brand
    """
    try:
        brand = db.session.get(Brand, id)
        if not brand:
            return jsonify({"error": "Brand not found"}), 404
        
        db.session.delete(brand)
        db.session.commit()

        return jsonify({"message": "Brand successfully deleted"}), 200
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable deleting brand: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def delete_inquiry(id):
    """    
    Deletes an inquiry from the database by its id

    Parameter:
        - inquiryId (int): identifies the inquiry
    """
    try:
        inquiry = db.session.get(Inquiry, id)
        if not inquiry:
            return jsonify({"error": "Inquiry not found"}), 404
        
        db.session.delete(inquiry)
        db.session.commit()

        return jsonify({"message": "Inquiry successfully deleted"}), 200
    
    except OperationalError as e:
        db.session.rollback()
        app.logger.error(f"DB unavailable deleting insquiry: {e}")
        return jsonify({"error": "DB unavailable"}), 500
    
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

DELETE_HANDLERS = {
    'orders': delete_order,
    'rackets': delete_racket,
    'strings': delete_string,
    'users': delete_user,
    'brands': delete_brand,
    'inquiries': delete_inquiry
}


@app.route('/api/<string:table>', methods=['GET'])
def get_entries(table: str):
    handler = LIST_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404
    return handler()


@app.route("/api/<string:table>/<int:id>", methods=['GET'])
def get_entry(table: str, id: int):
    print("handle get entry")
    handler = ENTRY_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404
    return handler(id)

@app.route("/api/<string:table>", methods=["POST"])
def create_entry(table: str):
    handler = CREATE_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404
    
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Missing request body"}), 400
    
    return handler(body)

@app.route("/api/<string:table>/<int:id>", methods=["PATCH"])
def update_entry(table: str, id: int):
    handler = UPDATE_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Missing request body"}), 400

    return handler(id, body)

@app.route("/api/<string:table>/<int:id>", methods=["DELETE"])
def delete_entry(table: str, id: int):
    handler = DELETE_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404

    return handler(id)


@app.route('/api/search-table', methods=['POST'])
def get_page():
    """
    Search the database and return a pagination object. Filters can be applied and will
    be applied programmatically based on the current tab.
    """
    data = request.get_json()

    if not data or 'tableName' not in data or 'page' not in data or 'perPage' not in data:
        return jsonify({"error": "Missing required fields 'page' or 'perPage'"}), 400
    
    tableName = data.get('tableName')
    table = MODEL_MAP[tableName]

    page = data.get('page')
    perPage = data.get('perPage')
    filters = data.get('filters')

    # Basic query
    stmt = db.select(table)

    # ==================== Applying Filters ============================
    # Order Filtering
    if filters and table == Order:
        if filters:
            username = filters.get('username')
            orderDate = filters.get('orderDate')
            dueDate = filters.get('dueDate')
            completed = filters.get('completed')
            paid = filters.get('paid')
            racketBrand = filters.get('racketBrand')
            racketName = filters.get('racketName')
            stringBrand = filters.get('stringBrand')
            stringName = filters.get('stringName')

            if username:
                stmt = stmt.where(table.user.has(User.username.ilike(f"%{username}%")))
            
            if orderDate:
                stmt = stmt.where(table.orderDate == orderDate)

            if dueDate:
                stmt = stmt.where(table.due == dueDate)

            if completed:
                if completed == 'completed':
                    stmt = stmt.where(table.complete == True)
                elif completed == 'uncompleted':
                    stmt = stmt.where(table.complete == False)

            if paid:
                if paid == 'paid':
                    stmt = stmt.where(table.paid == True)
                elif paid == 'unpaid':
                    stmt = stmt.where(table.paid == False)                

            if racketBrand:
                stmt = stmt.where(table.racket.has(Racket.brand.has(Brand.name.ilike(f"%{racketBrand}%"))))

            if racketName:
                stmt = stmt.where(table.racket.has(Racket.name.ilike(f"%{racketName}%")))
        
            if stringBrand:
                stmt = stmt.where(table.strungWithRecords.any(StrungWith.string.has(String.brand.has(Brand.name.ilike(f"%{stringBrand}%")))))

            if stringName:
                stmt = stmt.where(table.strungWithRecords.any(StrungWith.string.has(String.name.ilike(f"%{stringName}%"))))

        # Default Ordering
        stmt = stmt.order_by(table.due.desc()).order_by(table.id.asc())
    # Racket Filtering
    elif table == Racket:
        if filters:
            brandName = filters.get('brandName')
            racketName = filters.get('racketName')
            priceMin = filters.get('priceMin')
            priceMax = filters.get('priceMax')

            if brandName:
                stmt = stmt.where(table.brand.has(Brand.name.ilike(f"%{brandName}%")))

            if racketName:
                stmt = stmt.where(table.name.ilike(f"%{racketName}%"))
            
            if priceMin:
                stmt = stmt.where(table.price >= float(priceMin))

            if priceMax:
                stmt = stmt.where(table.price <= float(priceMax))

        stmt = stmt.order_by(db.func.lower(table.name).asc())
    # String Filtering
    elif table == String:
        if filters:
            brandName = filters.get('brandName')
            stringName = filters.get('stringName')
            priceMin = filters.get('priceMin')
            priceMax = filters.get('priceMax')

            if brandName:
                stmt = stmt.where(table.brand.has(Brand.name.ilike(f"%{brandName}%")))

            if stringName:
                stmt = stmt.where(table.name.ilike(f"%{stringName}%"))
            
            if priceMin:
                stmt = stmt.where(table.pricePerRacket >= float(priceMin))

            if priceMax:
                stmt = stmt.where(table.pricePerRacket <= float(priceMax))

        stmt = stmt.order_by(db.func.lower(table.name).asc())
    # User Filtering
    elif table == User:
        if filters:
            username = filters.get('username')

            if username:
                stmt = stmt.where(table.username.ilike(f"%{username}%"))

        stmt = stmt.order_by(db.func.lower(table.username).asc())
    # Brand Filtering
    elif table == Brand:
        if filters:
            brandName = filters.get('brandName')

            if brandName:
                stmt = stmt.where(table.name.ilike(f"%{brandName}%"))

        stmt = stmt.order_by(db.func.lower(table.name).asc())
    # Inquiry Filtering
    elif table == Inquiry:
        if filters:
            username = filters.get('username')
            inqDate = filters.get('inqDate')

            if username:
                stmt = stmt.where(table.name.ilike(f"%{username}%"))
            
            if inqDate:
                stmt = stmt.where(table.date == inqDate)
        
        stmt = stmt.order_by(table.date.desc()).order_by(db.func.lower(table.name).asc())   
    
    pagination = db.paginate(select=stmt, page=page, per_page=perPage)

    return {
        "items": [p.to_json() for p in pagination.items],
        "totalPages": pagination.pages,
        "currentPage": pagination.page,
        "hasNext": pagination.has_next,
        "perPage": pagination.per_page
        # "iter_pages": pagination.iter_pages(left_edge=2, left_current=1, right_current=2, right_edge=2)
    }


# ================================================================
# TODO: Assign a racket to a user by querying for the racket and 
#       the user then creating a new Owns object and adding the 
#       Owns object to the db
# ================================================================

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)