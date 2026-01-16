from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.exc import OperationalError, IntegrityError
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

# --- Routes ---

# Create DBs and seed data if empty (For testing)
@app.route('/init_db', methods=['POST'])
def init_db():
    with app.app_context():
        db.create_all()
        
        if not User.query.first():
            db.session.add(User(username="Alice"))
            db.session.add(User(username="Bob"))
            db.session.commit()
        
        alice = db.session.execute(db.select(User).filter_by(username="Alice")).scalar_one()
        bob = db.session.execute(db.select(User).filter_by(username="Bob")).scalar_one()

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
            db.session.add(String(name="ALU Power", price_per_racket=22, brand=luxilon))
            db.session.add(String(name="Hyper G", price_per_racket=20, brand=solinco))
            db.session.commit()

        alu_power = db.session.execute(db.select(String).filter_by(name="ALU Power")).scalar_one()
        hyper_g = db.session.execute(db.select(String).filter_by(name="Hyper G")).scalar_one()

        if not StrungWith.query.first():
            db.session.add(StrungWith(order=order1, string=alu_power, tension=50))
            db.session.add(StrungWith(order=order2, string=hyper_g, tension=52, direction="mains"))
            db.session.add(StrungWith(order=order2, string=alu_power, tension=50, direction="crosses"))
            db.session.commit()

        if not Owns.query.first():
            db.session.add(Owns(user=alice, racket=prostaff, quantity=1))
            db.session.add(Owns(user=bob, racket=speed, quantity=1))
            db.session.commit()  

        if not Inquiry.query.first():
            inquiryDate = date.today()
            db.session.add(Inquiry(name="Alex", email="example@ex.com", phone="5555555555", message='hello', date=inquiryDate)) 
            db.session.commit()     
        
    return jsonify({"message": "Database initialized!"})


# =======================================================================================================================
# ----------------------------User Routes--------------------------------------------------------------------------------
# =======================================================================================================================

@app.route('/users/', defaults={'limit': None})
@app.route('/users/<int:limit>', methods=['GET'])
def get_users(limit: int):
    query = db.select(User).order_by(User.username.asc())

    if limit is not None:
        query = query.limit(limit)

    try:
        users = db.session.execute(query).scalars().all()
        return jsonify([user.to_json() for user in users])
    except OperationalError:
        return jsonify([])
    

@app.route('/search-user-table/', methods=['GET'])
def search_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
        
    statement = db.select(User).order_by(User.username)

    pagination = db.paginate(select=statement, page=page, per_page=per_page)
    return {
        "items": [p.to_json() for p in pagination.items],
        "totalPages": pagination.pages,
        "currentPage": pagination.page,
        "hasNext": pagination.has_next,
        "perPage": pagination.per_page
        # "iter_pages": pagination.iter_pages(left_edge=2, left_current=1, right_current=2, right_edge=2)
    }

    
@app.route('/create-user', methods=['POST'])
def create_user():
    """    
    Create a user from a user form input
    """
    data = request.get_json()

    if not data or "username" not in data:
        return jsonify({"error": "Missing required fields 'username' or 'data'"}), 400
    
    username = data.get('username')

    existing_user = db.session.execute(db.select(User).filter_by(username=username)).first()
    if existing_user:
        return jsonify({"error": "This user already exists"}), 409

    try:
        user = User(username=username)
        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User successfully created", "user": user.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
@app.route('/delete-user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id: int):
    """    
    Delete a user
    """
    
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User successfully deleted"}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

# =======================================================================================================================
# ----------------------------Racket Routes-----------------------------------------------------------------------------
# =======================================================================================================================

@app.route('/rackets/', defaults={'limit': None})
@app.route('/rackets/<int:limit>', methods=['GET'])
def get_rackets(limit: int):
    query = db.select(Racket).order_by(Racket.name.asc())

    if limit is not None:
        query = query.limit(limit)
        
    try:
        rackets = db.session.execute(query).scalars().all()
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
    racket = db.session.get(Racket, racket_id)
    if racket: 
        return jsonify(racket.to_json())
    return jsonify({"error": "Racket not found"}), 404


@app.route('/search-racket-table/', methods=['GET'])
def search_rackets():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
        
    statement = db.select(Racket).order_by(Racket.name)

    pagination = db.paginate(select=statement, page=page, per_page=per_page)
    return {
        "items": [p.to_json() for p in pagination.items],
        "totalPages": pagination.pages,
        "currentPage": pagination.page,
        "hasNext": pagination.has_next,
        "perPage": pagination.per_page
        # "iter_pages": pagination.iter_pages(left_edge=2, left_current=1, right_current=2, right_edge=2)
    }


@app.route('/create-racket', methods=['POST'])
def create_racket():
    """    
    Create a racket from a user form input
    """
    data = request.get_json()

    if not data or "name" not in data or "price" not in data or "brand_id" not in data:
        return jsonify({"error": "Missing required fields 'name', 'price', 'brand_id' or 'data'"}), 400
    
    name = data.get('name')
    price = data.get('price')
    brand_id = data.get('brand_id')

    brand = db.session.get(Brand, brand_id)
    if not brand:
        return jsonify({"error": "Brand does not exist"}), 404

    existing_racket = db.session.execute(db.select(Racket).filter_by(name=name, price=price, brand=brand)).first()
    if existing_racket:
        return jsonify({"error": "This racket already exists"}), 409

    try:
        racket = Racket(name=name, price=price, brand=brand)
        db.session.add(racket)
        db.session.commit()

        return jsonify({"message": "Racket successfully created", "racket": racket.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
@app.route('/delete-racket/<int:racket_id>', methods=['DELETE'])
def delete_racket(racket_id: int):
    """    
    Delete a racket
    """
    
    racket = db.session.get(Racket, racket_id)
    if not racket:
        return jsonify({"error": "Racket not found"}), 404

    try:
        db.session.delete(racket)
        db.session.commit()

        return jsonify({"message": "Racket successfully deleted"}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
# =======================================================================================================================
# ----------------------------String Routes-----------------------------------------------------------------------------
# =======================================================================================================================

@app.route('/strings/', defaults={'limit': None})
@app.route('/strings/<int:limit>', methods=['GET'])
def get_strings(limit: int):
    query = db.select(String).order_by(String.name.asc())

    if limit is not None:
        query = query.limit(limit)
        
    try:
        strings = db.session.execute(query).scalars().all()
        return jsonify([s.to_json() for s in strings])
    except OperationalError:
        return jsonify([])
    

@app.route('/search-string-table/', methods=['GET'])
def search_strings():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
        
    statement = db.select(String).order_by(String.name)

    pagination = db.paginate(select=statement, page=page, per_page=per_page)
    return {
        "items": [p.to_json() for p in pagination.items],
        "totalPages": pagination.pages,
        "currentPage": pagination.page,
        "hasNext": pagination.has_next,
        "perPage": pagination.per_page
        # "iter_pages": pagination.iter_pages(left_edge=2, left_current=1, right_current=2, right_edge=2)
    }
    
@app.route('/create-string', methods=['POST'])
def create_string():
    """    
    Create a string from a user form input
    """
    data = request.get_json()

    if not data or "name" not in data or "price_per_racket" not in data or "brand_id" not in data:
        return jsonify({"error": "Missing required fields 'name', 'price_per_racket', 'brand_id', or 'data'"}), 400
    
    name = data.get('name')
    price_per_racket = data.get('price_per_racket')
    brand_id = data.get('brand_id')

    string_brand = db.session.get(Brand, brand_id)
    if not string_brand:
        return jsonify({"error": "Brand does not exist"}), 404

    existing_string = db.session.execute(db.select(String).filter_by(name=name, price_per_racket=price_per_racket, brand=string_brand)).first()
    if existing_string:
        return jsonify({"error": "This string already exists"}), 409

    try:
        string = String(name=name, price_per_racket=price_per_racket, brand=string_brand)
        db.session.add(string)
        db.session.commit()

        return jsonify({"message": "String successfully created", "string": string.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500


@app.route('/delete-string/<int:string_id>', methods=['DELETE'])
def delete_string(string_id: int):
    """    
    Delete a string
    """
    
    string = db.session.get(String, string_id)
    if not string:
        return jsonify({"error": "String not found"}), 404

    try:
        db.session.delete(string)
        db.session.commit()

        return jsonify({"message": "String successfully deleted"}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500


# =======================================================================================================================
# ----------------------------Order Routes-------------------------------------------------------------------------------
# =======================================================================================================================

@app.route('/orders/', defaults={'limit': None})
@app.route('/orders/<int:limit>', methods=['GET'])
def get_orders(limit: int):
    query = db.select(Order).order_by(Order.due.desc())

    if limit is not None:
        query = query.limit(limit)
        
    try:
        orders = db.session.execute(query).scalars().all()
        return jsonify([order.to_json() for order in orders])
    except OperationalError:
        return jsonify([])


@app.route('/search-order-table/', methods=['GET'])
def search_orders():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
        
    statement = db.select(Order).order_by(Order.orderDate)

    pagination = db.paginate(select=statement, page=page, per_page=per_page)
    return {
        "items": [p.to_json() for p in pagination.items],
        "totalPages": pagination.pages,
        "currentPage": pagination.page,
        "hasNext": pagination.has_next,
        "perPage": pagination.per_page
        # "iter_pages": pagination.iter_pages(left_edge=2, left_current=1, right_current=2, right_edge=2)
    }


@app.route('/create-order', methods=['POST'])
def create_order():
    """    
    Create an order from a user form input.
    Need to get date and set the due date then set price
    ================================================================================
    TODO: include logic to add the racket to their list of rackets if it does not exist?
    ================================================================================
    """
    data = request.get_json()

    if not data or "racket_id" not in data or "user_id" not in data or "string_id" not in data or "tension" not in data or "same_for_crosses" not in data or 'paid' not in data:
        return jsonify({"error": "Missing required fields 'racket', 'user_id', 'string', 'same_for_crosses', 'paid', or 'tension'"}), 400
    
    same_for_crosses = data.get('same_for_crosses')

    if not same_for_crosses and "crosses_id" not in data and 'crosses_tension' in data or "crosses_id" in data and 'crosses_tension' not in data:
        return jsonify({"error": "Missing required fields 'crosses_id' or 'crosses_tension'"}), 400
    
    racket_id = data.get('racket_id')
    user_id = data.get('user_id')
    string_id = data.get('string_id')
    tension = data.get('tension')
    paid = data.get('paid')

    # dates
    orderDate = date.today()
    four_days_later = date.today() + timedelta(days=4)

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User does not exist"}), 404
    
    racket = db.session.get(Racket, racket_id)
    if not racket:
        return jsonify({"error": "Racket does not exist"}), 404
    
    mains = db.session.get(String, string_id)
    if not mains:
        return jsonify({"error": "String does not exist"}), 404
    
    if not same_for_crosses:
        crosses_id = data.get('crosses_id')
        crosses_tension = data.get('crosses_tension')
        crosses = db.session.get(String, crosses_id)
        if not crosses:
            return jsonify({"error": "String does not exist"}), 404
        
        same_for_crosses = crosses.id == mains.id and crosses_tension == tension
    
    try:
        if same_for_crosses:
            price = 25 + mains.price_per_racket

            order = Order(orderDate=orderDate, due=four_days_later, price=price, complete=False, paid=paid, racket=racket, user=user)
            
            racketStrungWith = StrungWith(tension=tension, direction=None, string=mains)
            order.strung_with_records.append(racketStrungWith)
            
            db.session.add(order)
            db.session.commit()
        else:
            price = 25 + (mains.price_per_racket + crosses.price_per_racket)/2

            order = Order(orderDate=orderDate, due=four_days_later, price=price, complete=False, paid=paid, racket=racket, user=user)

            mainsStrungWith = StrungWith(tension=tension, direction="mains", string=mains)
            crossesStrungWith = StrungWith(tension=crosses_tension, direction="crosses", string=crosses)

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
        order = db.session.get(Order, order_id)
        
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
    

@app.route('/pay-for-order/<int:order_id>', methods=['PATCH'])
def pay_for_order(order_id: int):
    """
    Toggles paying for an order
    """    
    try:
        order = db.session.get(Order, order_id)
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        order.paid = not order.paid

        db.session.add(order)
        db.session.commit()

        return jsonify({"message": "Order toggled paying for an order", "order": order.to_json()}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
    
@app.route('/delete-order/<int:order_id>', methods=['DELETE'])
def delete_order(order_id: int):
    """    
    Delete an order
    """
    
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    try:
        db.session.delete(order)
        db.session.commit()

        return jsonify({"message": "Order successfully deleted"}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500


# =======================================================================================================================
# ----------------------------Brand Routes-------------------------------------------------------------------------------
# =======================================================================================================================

@app.route('/brands/', defaults={'limit': None})
@app.route('/brands/<int:limit>', methods=['GET'])
def get_brands(limit: int):
    query = db.select(Brand).order_by(Brand.name.asc())

    if limit is not None:
        query = query.limit(limit)
        
    try:
        brands = db.session.execute(query).scalars().all()
        return jsonify([b.to_json() for b in brands])
    except OperationalError:
        return jsonify([])


@app.route('/search-brand-table/', methods=['GET'])
def search_brands():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
        
    statement = db.select(Brand).order_by(Brand.name)

    pagination = db.paginate(select=statement, page=page, per_page=per_page)
    return {
        "items": [p.to_json() for p in pagination.items],
        "totalPages": pagination.pages,
        "currentPage": pagination.page,
        "hasNext": pagination.has_next,
        "perPage": pagination.per_page
        # "iter_pages": pagination.iter_pages(left_edge=2, left_current=1, right_current=2, right_edge=2)
    }


@app.route('/create-brand', methods=['POST'])
def create_brand():
    """    
    Create a brand from a user form input
    """
    data = request.get_json()

    if not data or "name" not in data:
        return jsonify({"error": "Missing required fields 'name' or 'data'"}), 400
    
    name = data.get('name')

    existing_brand = db.session.execute(db.select(Brand).filter_by(name=name)).first()
    if existing_brand:
        return jsonify({"error": "This user already exists"}), 409

    try:
        brand = Brand(name=name)
        db.session.add(brand)
        db.session.commit()

        return jsonify({"message": "Brand successfully created", "brand": brand.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
@app.route('/delete-brand/<int:brand_id>', methods=['DELETE'])
def delete_brand(brand_id: int):
    """    
    Delete a brand
    """
    
    brand = db.session.get(Brand, brand_id)
    if not brand:
        return jsonify({"error": "Brand not found"}), 404

    try:
        db.session.delete(brand)
        db.session.commit()

        return jsonify({"message": "Brand successfully deleted"}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    

# =======================================================================================================================
# ----------------------------Inquiry Routes-------------------------------------------------------------------------------
# =======================================================================================================================

@app.route('/inquiries/', defaults={'limit': None})
@app.route('/inquiries/<int:limit>', methods=['GET'])
def get_inquiries(limit: int):
    query = db.select(Inquiry).order_by(Inquiry.name.asc())

    if limit is not None:
        query = query.limit(limit)
        
    try:
        inquiries = db.session.execute(query).scalars().all()
        return jsonify([b.to_json() for b in inquiries])
    except OperationalError:
        return jsonify([])
    
    
@app.route('/search-inquiry-table/', methods=['GET'])
def search_inquiries():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
        
    statement = db.select(Inquiry).order_by(Inquiry.date)

    pagination = db.paginate(select=statement, page=page, per_page=per_page)
    return {
        "items": [p.to_json() for p in pagination.items],
        "totalPages": pagination.pages,
        "currentPage": pagination.page,
        "hasNext": pagination.has_next,
        "perPage": pagination.per_page
        # "iter_pages": pagination.iter_pages(left_edge=2, left_current=1, right_current=2, right_edge=2)
    }


@app.route('/create-inquiry', methods=['POST'])
def create_inquiry():
    """    
    Create an inquiry from a user form input
    """
    data = request.get_json()

    if not data or "name" not in data or "email" not in data or "message" not in data:
        return jsonify({"error": "Missing required fields 'name', 'email', 'message' or 'data'"}), 400
    
    name = data.get('name')
    phone = data.get('phone')
    email = data.get('email')
    message = data.get('message')
    inquiryDate = date.today()

    try:
        inquiry = Inquiry(name=name, phone=phone, email=email, message=message, date=inquiryDate)
        db.session.add(inquiry)
        db.session.commit()

        return jsonify({"message": "Inquiry successfully created", "inquiry": inquiry.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
@app.route('/delete-inquiry/<int:inquiry_id>', methods=['DELETE'])
def delete_inquiry(inquiry_id: int):
    """    
    Delete a inquiry
    """
    
    inquiry = db.session.get(Inquiry, inquiry_id)
    if not inquiry:
        return jsonify({"error": "Inquiry not found"}), 404

    try:
        db.session.delete(inquiry)
        db.session.commit()

        return jsonify({"message": "Inquiry successfully deleted"}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
# ================================================================
# TODO: Assign a racket to a user by querying for the racket and 
#       the user then creating a new Owns object and adding the 
#       Owns object to the db
# ================================================================

if __name__ == '__main__':
    app.run(debug=True, port=5000)