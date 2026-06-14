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

MODEL_MAP = {
    "brands": Brand,
    "rackets": Racket,
    "strings": String,
    "users": User,
    "inquiries": Inquiry,
    "orders": Order
}

# =======================================================================================================================
# ----------------------------General Routes--------------------------------------------------------------------------------
# =======================================================================================================================
@app.route('/init_db', methods=['POST'])
def init_db():
    """
    Generates basic data to test database interactions and front end
    """
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
            db.session.add(String(name="ALU Power", pricePerRacket=22, brand=luxilon))
            db.session.add(String(name="Hyper G", pricePerRacket=20, brand=solinco))
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


@app.route('/search-table/', methods=['POST'])
def search_table():
    """
    Search the database and return a pagination object. Filters can be applied and will
    be applied programmatically based on the current tab.
    """
    data = request.get_json()

    if not data or 'table_name' not in data or 'page' not in data or 'perPage' not in data:
        return jsonify({"error": "Missing required fields 'page' or 'perPage'"}), 400
    
    table_name = data.get('table_name')
    table = MODEL_MAP[table_name]

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
    
    pagination = db.paginate(select=stmt, page=page, perPage=perPage)

    return {
        "items": [p.to_json() for p in pagination.items],
        "totalPages": pagination.pages,
        "currentPage": pagination.page,
        "hasNext": pagination.has_next,
        "perPage": pagination.perPage
        # "iter_pages": pagination.iter_pages(left_edge=2, left_current=1, right_current=2, right_edge=2)
    }


# =======================================================================================================================
# ----------------------------User Routes--------------------------------------------------------------------------------
# =======================================================================================================================

@app.route('/users/', defaults={'limit': None})
@app.route('/users/<int:limit>', methods=['GET'])
def get_users(limit: int):
    """
    Gets users from the database

    Parameters:
        - limit (int): limits the number of items that are returned
    """
    query = db.select(User).order_by(User.username.asc())

    # Checks if there is a limit
    if limit is not None:
        query = query.limit(limit)

    try:
        users = db.session.execute(query).scalars().all()
        return jsonify([user.to_json() for user in users])
    except OperationalError:
        return jsonify([])

    
@app.route('/create-user', methods=['POST'])
def create_user():
    """    
    Create a user from a user form input

    Expected JSON Format:
    {
        'username': username
    }
    """
    data = request.get_json()

    if not data or "username" not in data:
        return jsonify({"error": "Missing required fields 'username' or 'data'"}), 400
    
    username = data.get('username')

    # Checks for an existing user
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
    
@app.route('/delete-user/<int:userId>', methods=['DELETE'])
def delete_user(userId: int):
    """    
    Delete a user from the database

    Parameters:
        - userId (int): identifies the user
    """
    
    user = db.session.get(User, userId)
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
    """
    Fetches rackets from the database

    Parameters:
        - limit (int): limits the number of items returned by the databse
    """
    query = db.select(Racket).order_by(Racket.name.asc())

    # Checks for a limit
    if limit is not None:
        query = query.limit(limit)
        
    try:
        rackets = db.session.execute(query).scalars().all()
        return jsonify([r.to_json() for r in rackets])
    except OperationalError:
        return jsonify([])
    
@app.route('/get-racket-by-id/<int:racketId>', methods=['GET'])
def get_racket_by_id(racketId: int):
    """    
    Fetches a single racket from the database by its id

    Parameter:
        - racketId (int): identifies the racket
    """
    racket = db.session.get(Racket, racketId)
    if racket: 
        return jsonify(racket.to_json())
    return jsonify({"error": "Racket not found"}), 404


@app.route('/create-racket', methods=['POST'])
def create_racket():
    """    
    Creates a racket

    Expected JSON Format:
    {
        'name': name,
        'price': price,
        'brandId': brandId
    }
    """
    data = request.get_json()

    if not data or "name" not in data or "price" not in data or "brandId" not in data:
        return jsonify({"error": "Missing required fields 'name', 'price', 'brandId' or 'data'"}), 400
    
    name = data.get('name')
    price = data.get('price')
    brandId = data.get('brandId')

    # Looks for brand first
    brand = db.session.get(Brand, brandId)
    if not brand:
        return jsonify({"error": "Brand does not exist"}), 404

    # Checks for an existing racket
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
    
@app.route('/delete-racket/<int:racketId>', methods=['DELETE'])
def delete_racket(racketId: int):
    """    
    Deletes a single racket from the database by its id

    Parameter:
        - racketId (int): identifies the racket
    """
    racket = db.session.get(Racket, racketId)
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
    """
    Fetches strings from the database

    Parameters:
        - limit (int): limits the number of items returned by the databse
    """
    query = db.select(String).order_by(String.name.asc())

    if limit is not None:
        query = query.limit(limit)
        
    try:
        strings = db.session.execute(query).scalars().all()
        return jsonify([s.to_json() for s in strings])
    except OperationalError:
        return jsonify([])

    
@app.route('/create-string', methods=['POST'])
def create_string():
    """    
    Creates a string

    Expected JSON Format:
    {
        'name': name,
        'pricePerRacket': pricePerRacket,
        'brandId': brandId
    }
    """
    data = request.get_json()

    if not data or "name" not in data or "pricePerRacket" not in data or "brandId" not in data:
        return jsonify({"error": "Missing required fields 'name', 'pricePerRacket', 'brandId', or 'data'"}), 400
    
    name = data.get('name')
    pricePerRacket = data.get('pricePerRacket')
    brandId = data.get('brandId')

    # Looks for brand
    stringBrand = db.session.get(Brand, brandId)
    if not stringBrand:
        return jsonify({"error": "Brand does not exist"}), 404

    # Checks for an existing string
    existing_string = db.session.execute(db.select(String).filter_by(name=name, pricePerRacket=pricePerRacket, brand=stringBrand)).first()
    if existing_string:
        return jsonify({"error": "This string already exists"}), 409

    try:
        string = String(name=name, pricePerRacket=pricePerRacket, brand=stringBrand)
        db.session.add(string)
        db.session.commit()

        return jsonify({"message": "String successfully created", "string": string.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500


@app.route('/delete-string/<int:stringId>', methods=['DELETE'])
def delete_string(stringId: int):
    """    
    Deletes a string from the database by its id

    Parameter:
        - stringId (int): identifies the string
    """
    string = db.session.get(String, stringId)
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
    """
    Fetches orders from the database

    Parameters:
        - limit (int): limits the number of items returned by the databse
    """
    query = db.select(Order).order_by(Order.due.desc())

    if limit is not None:
        query = query.limit(limit)
        
    try:
        orders = db.session.execute(query).scalars().all()
        return jsonify([order.to_json() for order in orders])
    except OperationalError:
        return jsonify([])
    

@app.route('/get-order/<int:orderId>', methods=['GET'])
def get_order_by_id(orderId: int):
    """    
    Fetches a single racket from the database by its id

    Parameter:
        - racketId (int): identifies the racket
    """
    racket = db.session.get(Order, orderId)
    if racket: 
        return jsonify(racket.to_json())
    return jsonify({"error": "Racket not found"}), 404


@app.route('/create-order', methods=['POST'])
def create_order():
    """    
    Creates an order. Automatically calculates the price based on the strings plus the default labor cost.
    The variable sameForCrosses will is false for a hybrid setup. Change the laborCost and laborDays 
    variables to adjust the final price and the due date.

    Expected JSON Format:
    {
        'userId': userId,
        'racketId': racketId,
        'stringId': stringId,
        'tension': tension,
        'sameForCrosses': sameForCrosses,
        'paid': paid
    }

    Default Labor Cost: $25 per racket -> laborCost
    Default Labor Days: 4 days per racket -> laborDays

    ================================================================================
    TODO: include logic to add the racket to their list of rackets if it does not exist?
    ================================================================================
    """
    laborCost = 25
    laborDays = 4
    data = request.get_json()

    if not data or "racketId" not in data or "userId" not in data or "mainsId" not in data or "mainsTension" not in data or "sameForCrosses" not in data or 'paid' not in data:
        return jsonify({"error": "Missing required fields 'racketId', 'userId', 'mainsId', 'mainsTension', 'sameForCrosses', or 'paid'"}), 400
    
    sameForCrosses = data.get('sameForCrosses')

    if not sameForCrosses and "crossesId" not in data and 'crossesTension' in data or "crossesId" in data and 'crossesTension' not in data:
        return jsonify({"error": "Missing required fields 'crossesId' or 'crossesTension'"}), 400
    
    racketId = data.get('racketId')
    userId = data.get('userId')
    mainsId = data.get('mainsId')
    mainsTension = data.get('mainsTension')
    paid = data.get('paid')

    # Dates
    orderDate = date.today()
    fourDaysLater = date.today() + timedelta(days=laborDays)

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
        crossesId = data.get('crossesId')
        crossesTension = data.get('crossesTension')
        crosses = db.session.get(String, crossesId)
        if not crosses:
            return jsonify({"error": "String does not exist"}), 404
        
        sameForCrosses = crosses.id == mains.id and crossesTension == mainsTension
    
    try:
        if sameForCrosses:
            # Single string setup
            price = laborCost + mains.pricePerRacket

            order = Order(orderDate=orderDate, due=fourDaysLater, price=price, complete=False, paid=paid, racket=racket, user=user)
            
            racketStrungWith = StrungWith(tension=mainsTension, direction=None, string=mains)
            order.strungWithRecords.append(racketStrungWith)
            
            db.session.add(order)
            db.session.commit()
        else:
            # Hybrid setup
            price = laborCost + (mains.pricePerRacket + crosses.pricePerRacket)/2

            order = Order(orderDate=orderDate, due=fourDaysLater, price=price, complete=False, paid=paid, racket=racket, user=user)

            mainsStrungWith = StrungWith(tension=mainsTension, direction="mains", string=mains)
            crossesStrungWith = StrungWith(tension=crossesTension, direction="crosses", string=crosses)

            order.strungWithRecords.extend([mainsStrungWith, crossesStrungWith])
            db.session.add(order)
            db.session.commit()

        return jsonify({"message": "Order successfully created", "order": order.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    

@app.route('/update-order', methods=['POST'])
def update_order():
    """    
    Updates an order.

    Expected JSON Format:
    {
        'userId': userId,
        'racketId': racketId,
        'stringId': stringId,
        'tension': tension,
        'sameForCrosses': sameForCrosses,
        'paid': paid
    }
    """
    laborDays = 4
    laborCost = 25
    data = request.get_json()

    if not data or "racketId" not in data or "userId" not in data or "stringId" not in data or "tension" not in data or "sameForCrosses" not in data or 'paid' not in data:
        return jsonify({"error": "Missing required fields 'racket', 'userId', 'string', 'sameForCrosses', 'paid', or 'tension'"}), 400
    
    sameForCrosses = data.get('sameForCrosses')

    if not sameForCrosses and "crossesId" not in data and 'crossesTension' in data or "crossesId" in data and 'crossesTension' not in data:
        return jsonify({"error": "Missing required fields 'crossesId' or 'crossesTension'"}), 400
    
    racketId = data.get('racketId')
    userId = data.get('userId')
    stringId = data.get('stringId')
    tension = data.get('tension')
    paid = data.get('paid')

    # Dates
    orderDate = date.today()
    fourDaysLater = date.today() + timedelta(days=laborDays)

    user = db.session.get(User, userId)
    if not user:
        return jsonify({"error": "User does not exist"}), 404
    
    racket = db.session.get(Racket, racketId)
    if not racket:
        return jsonify({"error": "Racket does not exist"}), 404
    
    mains = db.session.get(String, stringId)
    if not mains:
        return jsonify({"error": "String does not exist"}), 404
    

    if not sameForCrosses:
        crossesId = data.get('crossesId')
        crossesTension = data.get('crossesTension')
        crosses = db.session.get(String, crossesId)
        if not crosses:
            return jsonify({"error": "String does not exist"}), 404
        
        sameForCrosses = crosses.id == mains.id and crossesTension == tension
    
    try:
        if sameForCrosses:
            # Single string setup
            price = laborCost + mains.pricePerRacket

            order = Order(orderDate=orderDate, due=fourDaysLater, price=price, complete=False, paid=paid, racket=racket, user=user)
            
            racketStrungWith = StrungWith(tension=tension, direction=None, string=mains)
            order.strungWithRecords.append(racketStrungWith)
            
            db.session.add(order)
            db.session.commit()
        else:
            # Hybrid setup
            price = laborCost + (mains.pricePerRacket + crosses.pricePerRacket)/2

            order = Order(orderDate=orderDate, due=fourDaysLater, price=price, complete=False, paid=paid, racket=racket, user=user)

            mainsStrungWith = StrungWith(tension=tension, direction="mains", string=mains)
            crossesStrungWith = StrungWith(tension=crossesTension, direction="crosses", string=crosses)

            order.strungWithRecords.extend([mainsStrungWith, crossesStrungWith])
            db.session.add(order)
            db.session.commit()

        return jsonify({"message": "Order successfully created", "order": order.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    

@app.route('/complete-order/<int:orderId>', methods=['PATCH'])
def complete_order(orderId: int):
    """
    Marks an order as completed.
    """
    try:
        order = db.session.get(Order, orderId)
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        if order.complete:
            return jsonify({
                "message": "Order was already completed", 
                "order": order.to_json() 
            }), 200
        
        order.complete = not order.complete

        print("Is complete:", order.complete)

        db.session.add(order)
        db.session.commit()

        return jsonify({"message": "Order successfully completed", "order": order.to_json()}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    

@app.route('/toggle-complete/<int:orderId>', methods=['PATCH'])
def toggle_complete(orderId: int):
    """
    Marks and order as completed/uncompleted. Is toggled from the store dashboard.
    """
    try:
        order = db.session.get(Order, orderId)
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        order.complete = not order.complete

        print("Is complete:", order.complete)

        db.session.add(order)
        db.session.commit()

        return jsonify({"message": "Order complete field successfully toggled", "order": order.to_json()}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    

@app.route('/pay-for-order/<int:orderId>', methods=['PATCH'])
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

    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
    
@app.route('/delete-order/<int:orderId>', methods=['DELETE'])
def delete_order(orderId: int):
    """    
    Deletes an order from the database by its id

    Parameter:
        - orderId (int): identifies the order
    """
    
    order = db.session.get(Order, orderId)
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
    """
    Fetches brands from the database

    Parameters:
        - limit (int): limits the number of items returned by the databse
    """
    query = db.select(Brand).order_by(Brand.name.asc())

    if limit is not None:
        query = query.limit(limit)
        
    try:
        brands = db.session.execute(query).scalars().all()
        return jsonify([b.to_json() for b in brands])
    except OperationalError:
        return jsonify([])


@app.route('/create-brand', methods=['POST'])
def create_brand():
    """    
    Creates a brand

    Expected JSON Format:
    {
        'name': name
    }
    """
    data = request.get_json()

    if not data or "name" not in data:
        return jsonify({"error": "Missing required fields 'name' or 'data'"}), 400
    
    name = data.get('name')
    
    # Checks for an existing brand
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
    
@app.route('/delete-brand/<int:brandId>', methods=['DELETE'])
def delete_brand(brandId: int):
    """    
    Deletes a brand from the database by its id

    Parameter:
        - brandId (int): identifies the brand
    """
    
    brand = db.session.get(Brand, brandId)
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
    """
    Fetches inquiries from the database

    Parameters:
        - limit (int): limits the number of items returned by the databse
    """
    query = db.select(Inquiry).order_by(Inquiry.name.asc())

    if limit is not None:
        query = query.limit(limit)
        
    try:
        inquiries = db.session.execute(query).scalars().all()
        return jsonify([b.to_json() for b in inquiries])
    except OperationalError:
        return jsonify([])


@app.route('/create-inquiry', methods=['POST'])
def create_inquiry():
    """    
    Creates a brand

    Expected JSON Format:
    {
        'name': name,
        'phone': phone,
        'email': email,
        'message': message
    }
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
    Deletes an inquiry from the database by its id

    Parameter:
        - inquiry_id (int): identifies the inquiry
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