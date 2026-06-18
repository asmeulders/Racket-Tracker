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


# @app.route('/api/search-table', methods=['POST'])
# def search_table():
    # """
    # Search the database and return a pagination object. Filters can be applied and will
    # be applied programmatically based on the current tab.
    # """
    # data = request.get_json()

    # if not data or 'tableName' not in data or 'page' not in data or 'perPage' not in data:
    #     return jsonify({"error": "Missing required fields 'page' or 'perPage'"}), 400
    
    # tableName = data.get('tableName')
    # table = MODEL_MAP[tableName]

    # page = data.get('page')
    # perPage = data.get('perPage')
    # filters = data.get('filters')

    # # Basic query
    # stmt = db.select(table)

    # # ==================== Applying Filters ============================
    # # Order Filtering
    # if filters and table == Order:
    #     if filters:
    #         username = filters.get('username')
    #         orderDate = filters.get('orderDate')
    #         dueDate = filters.get('dueDate')
    #         completed = filters.get('completed')
    #         paid = filters.get('paid')
    #         racketBrand = filters.get('racketBrand')
    #         racketName = filters.get('racketName')
    #         stringBrand = filters.get('stringBrand')
    #         stringName = filters.get('stringName')

    #         if username:
    #             stmt = stmt.where(table.user.has(User.username.ilike(f"%{username}%")))
            
    #         if orderDate:
    #             stmt = stmt.where(table.orderDate == orderDate)

    #         if dueDate:
    #             stmt = stmt.where(table.due == dueDate)

    #         if completed:
    #             if completed == 'completed':
    #                 stmt = stmt.where(table.complete == True)
    #             elif completed == 'uncompleted':
    #                 stmt = stmt.where(table.complete == False)

    #         if paid:
    #             if paid == 'paid':
    #                 stmt = stmt.where(table.paid == True)
    #             elif paid == 'unpaid':
    #                 stmt = stmt.where(table.paid == False)                

    #         if racketBrand:
    #             stmt = stmt.where(table.racket.has(Racket.brand.has(Brand.name.ilike(f"%{racketBrand}%"))))

    #         if racketName:
    #             stmt = stmt.where(table.racket.has(Racket.name.ilike(f"%{racketName}%")))
        
    #         if stringBrand:
    #             stmt = stmt.where(table.strungWithRecords.any(StrungWith.string.has(String.brand.has(Brand.name.ilike(f"%{stringBrand}%")))))

    #         if stringName:
    #             stmt = stmt.where(table.strungWithRecords.any(StrungWith.string.has(String.name.ilike(f"%{stringName}%"))))

    #     # Default Ordering
    #     stmt = stmt.order_by(table.due.desc()).order_by(table.id.asc())
    # # Racket Filtering
    # elif table == Racket:
    #     if filters:
    #         brandName = filters.get('brandName')
    #         racketName = filters.get('racketName')
    #         priceMin = filters.get('priceMin')
    #         priceMax = filters.get('priceMax')

    #         if brandName:
    #             stmt = stmt.where(table.brand.has(Brand.name.ilike(f"%{brandName}%")))

    #         if racketName:
    #             stmt = stmt.where(table.name.ilike(f"%{racketName}%"))
            
    #         if priceMin:
    #             stmt = stmt.where(table.price >= float(priceMin))

    #         if priceMax:
    #             stmt = stmt.where(table.price <= float(priceMax))

    #     stmt = stmt.order_by(db.func.lower(table.name).asc())
    # # String Filtering
    # elif table == String:
    #     if filters:
    #         brandName = filters.get('brandName')
    #         stringName = filters.get('stringName')
    #         priceMin = filters.get('priceMin')
    #         priceMax = filters.get('priceMax')

    #         if brandName:
    #             stmt = stmt.where(table.brand.has(Brand.name.ilike(f"%{brandName}%")))

    #         if stringName:
    #             stmt = stmt.where(table.name.ilike(f"%{stringName}%"))
            
    #         if priceMin:
    #             stmt = stmt.where(table.pricePerRacket >= float(priceMin))

    #         if priceMax:
    #             stmt = stmt.where(table.pricePerRacket <= float(priceMax))

    #     stmt = stmt.order_by(db.func.lower(table.name).asc())
    # # User Filtering
    # elif table == User:
    #     if filters:
    #         username = filters.get('username')

    #         if username:
    #             stmt = stmt.where(table.username.ilike(f"%{username}%"))

    #     stmt = stmt.order_by(db.func.lower(table.username).asc())
    # # Brand Filtering
    # elif table == Brand:
    #     if filters:
    #         brandName = filters.get('brandName')

    #         if brandName:
    #             stmt = stmt.where(table.name.ilike(f"%{brandName}%"))

    #     stmt = stmt.order_by(db.func.lower(table.name).asc())
    # # Inquiry Filtering
    # elif table == Inquiry:
    #     if filters:
    #         username = filters.get('username')
    #         inqDate = filters.get('inqDate')

    #         if username:
    #             stmt = stmt.where(table.name.ilike(f"%{username}%"))
            
    #         if inqDate:
    #             stmt = stmt.where(table.date == inqDate)
        
    #     stmt = stmt.order_by(table.date.desc()).order_by(db.func.lower(table.name).asc())   
    
    # pagination = db.paginate(select=stmt, page=page, per_page=perPage)

    # return {
    #     "items": [p.to_json() for p in pagination.items],
    #     "totalPages": pagination.pages,
    #     "currentPage": pagination.page,
    #     "hasNext": pagination.has_next,
    #     "perPage": pagination.per_page
    #     # "iter_pages": pagination.iter_pages(left_edge=2, left_current=1, right_current=2, right_edge=2)
    # }


# =======================================================================================================================
# ----------------------------User Routes--------------------------------------------------------------------------------
# =======================================================================================================================

# @app.route('/api/users', defaults={'limit': None})
# @app.route('/api/users/<int:limit>', methods=['GET'])
# def get_users(limit: int):
#     """
#     Gets users from the database

#     Parameters:
#         - limit (int): limits the number of items that are returned
#     """
#     query = db.select(User).order_by(User.username.asc())

#     # Checks if there is a limit
#     if limit is not None:
#         query = query.limit(limit)

#     try:
#         users = db.session.execute(query).scalars().all()
#         return jsonify([user.to_json() for user in users])
#     except OperationalError:
#         return jsonify([])
    

# @app.route('/api/get-user-by-id/<int:userId>', methods=['GET'])
# def get_user_by_id(userId: int):
#     """    
#     Fetches a user from the database by its id.

#     Parameter:
#         - userId (int): identifies the user
#     """
#     user = db.session.get(User, userId)
#     if user: 
#         return jsonify(user.to_json())
#     return jsonify({"error": "User not found"}), 404

    
# @app.route('/api/create-user', methods=['POST'])
# def create_user():
#     """    
#     Create a user from a user form input

#     Expected JSON Format:
#     {
#         'username': username,
#         'firstName': firstName,
#         'lastName': lastName,
#         'phone': phone,
#         'email': email
#     }
#     """
#     data = request.get_json()

#     if not data or "username" not in data or 'firstName' not in data or 'lastName' not in data or 'email' not in data:
#         return jsonify({"error": "Missing 'data' or required fields 'username', 'firstName', 'lastName', 'email'."}), 400
    
#     username = data.get('username')
#     firstName = data.get('firstName')
#     lastName = data.get('lastName')
#     email = data.get('email')
#     phone = None
#     if 'phone' in data:
#         phone = data.get('phone')

#     # Checks for an existing user
#     existingUser = db.session.execute(db.select(User).filter_by(username=username)).first()
#     if existingUser:
#         return jsonify({"error": "A user with this username already exists"}), 409

#     try:
#         user = User(username=username, firstName=firstName, lastName=lastName, email=email, phone=phone)
#         db.session.add(user)
#         db.session.commit()

#         return jsonify({"message": "User successfully created", "user": user.to_json()}), 201
    
#     except Exception as e:
#         db.session.rollback()
#         print(f"Server error: {str(e)}")
#         return jsonify({"error": "An internal error has occurred."}), 500
    

@app.route('/api/update-user', methods=['POST'])
def update_user():
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

    data = request.get_json()

    if not data or "userId" not in data:
        return jsonify({"error": "Missing data or required field 'userId'"}), 400
    
    # change to all fields being required??
    userId = data.get('userId')
    username = firstName = lastName = phone = email = None
    if 'username' in data:
        username = data.get('username')
    if 'firstName' in data:
        firstName = data.get('firstName')
    if 'lastName' in data:
        lastName = data.get('lastName')
    if 'phone' in data:
        phone = data.get('phone')
    if 'email' in data:
        email = data.get('email')

    try:
        user = db.session.get(User, userId)
        if username:
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
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    

@app.route('/api/delete-user/<int:userId>', methods=['DELETE'])
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

# @app.route('/api/rackets/', defaults={'limit': None})
# @app.route('/api/rackets/<int:limit>', methods=['GET'])
# def get_rackets(limit: int):
#     """
#     Fetches rackets from the database

#     Parameters:
#         - limit (int): limits the number of items returned by the databse
#     """
#     query = db.select(Racket).order_by(Racket.name.asc())

#     # Checks for a limit
#     if limit is not None:
#         query = query.limit(limit)
        
#     try:
#         rackets = db.session.execute(query).scalars().all()
#         return jsonify([r.to_json() for r in rackets])
#     except OperationalError:
#         return jsonify([])
    
# @app.route('/api/get-racket-by-id/<int:racketId>', methods=['GET'])
# def get_racket_by_id(racketId: int):
#     """    
#     Fetches a single racket from the database by its id

#     Parameter:
#         - racketId (int): identifies the racket
#     """
#     racket = db.session.get(Racket, racketId)
#     if racket: 
#         return jsonify(racket.to_json())
#     return jsonify({"error": "Racket not found"}), 404


@app.route('/api/create-racket', methods=['POST'])
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
    existingRacket = db.session.execute(db.select(Racket).filter_by(name=name, price=price, brand=brand)).first()
    if existingRacket:
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
    

@app.route('/api/update-racket', methods=['POST'])
def update_racket():
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

    data = request.get_json()

    if not data or "racketId" not in data:
        return jsonify({"error": "Missing required field 'racketId'"}), 400
    
    # change to all fields being required??
    racketId = data.get('racketId')
    brandId = name = price = None
    if 'brandId' in data:
        brandId = data.get('brandId')
    if 'name' in data:
        name = data.get('name')
    if 'price' in data:
        price = data.get('price')

    try:
        racket = db.session.get(Racket, racketId)
        if brandId:
            racket.brandId = brandId
        if name:
            racket.name = name
        if price:
            racket.price = price

        db.session.commit()
        return jsonify({"message": "Racket successfully updated", "racket": racket.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
    
@app.route('/api/delete-racket/<int:racketId>', methods=['DELETE'])
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

# @app.route('/api/strings/', defaults={'limit': None})
# @app.route('/api/strings/<int:limit>', methods=['GET'])
# def get_strings(limit: int):
#     """
#     Fetches strings from the database

#     Parameters:
#         - limit (int): limits the number of items returned by the databse
#     """
#     query = db.select(String).order_by(String.name.asc())

#     if limit is not None:
#         query = query.limit(limit)
        
#     try:
#         strings = db.session.execute(query).scalars().all()
#         return jsonify([s.to_json() for s in strings])
#     except OperationalError:
#         return jsonify([])
    

# @app.route('/api/get-string-by-id/<int:stringId>', methods=['GET'])
# def get_string_by_id(stringId: int):
#     """    
#     Fetches a single string from the database by its id.

#     Parameter:
#         - stringId (int): identifies the string
#     """
#     string = db.session.get(String, stringId)
#     if string: 
#         return jsonify(string.to_json())
#     return jsonify({"error": "String not found"}), 404

    
@app.route('/api/create-string', methods=['POST'])
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
    existingString = db.session.execute(db.select(String).filter_by(name=name, pricePerRacket=pricePerRacket, brand=stringBrand)).first()
    if existingString:
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
    

@app.route('/api/update-string', methods=['POST'])
def update_string():
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

    data = request.get_json()

    if not data or "stringId" not in data:
        return jsonify({"error": "Missing required field 'stringId'"}), 400
    
    # change to all fields being required??
    stringId = data.get('stringId')
    brandId = name = pricePerRacket = None
    if 'brandId' in data:
        brandId = data.get('brandId')
    if 'name' in data:
        name = data.get('name')
    if 'pricePerRacket' in data:
        pricePerRacket = data.get('pricePerRacket')

    try:
        string = db.session.get(String, stringId)
        if brandId:
            string.brandId = brandId
        if name:
            string.name = name
        if pricePerRacket:
            string.pricePerRacket = pricePerRacket

        db.session.commit()
        return jsonify({"message": "String successfully updated", "string": string.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500


@app.route('/api/delete-string/<int:stringId>', methods=['DELETE'])
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

# @app.route('/api/orders/', defaults={'limit': None})
# @app.route('/api/orders/<int:limit>', methods=['GET'])
# def get_orders(limit: int):
#     """
#     Fetches orders from the database

#     Parameters:
#         - limit (int): limits the number of items returned by the databse
#     """
#     query = db.select(Order).order_by(Order.due.desc())

#     if limit is not None:
#         query = query.limit(limit)
        
#     try:
#         orders = db.session.execute(query).scalars().all()
#         return jsonify([order.to_json() for order in orders])
#     except OperationalError:
#         return jsonify([])
    

# @app.route('/api/get-order-by-id/<int:orderId>', methods=['GET'])
# def get_order_by_id(orderId: int):
#     """    
#     Fetches a single racket from the database by its id

#     Parameter:
#         - racketId (int): identifies the racket
#     """
#     racket = db.session.get(Order, orderId)
#     if racket: 
#         return jsonify(racket.to_json())
#     return jsonify({"error": "Racket not found"}), 404


@app.route('/api/create-order', methods=['POST'])
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
    

@app.route('/api/update-order', methods=['POST'])
def update_order():
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

    data = request.get_json()

    if not data or "orderId" not in data or "sameForCrosses" not in data:
        return jsonify({"error": "Missing required field 'orderId' or 'sameForCrosses'"}), 400
    
    sameForCrosses = data.get('sameForCrosses')

    if not sameForCrosses and "crossesId" not in data and 'crossesTension' in data or "crossesId" in data and 'crossesTension' not in data:
        return jsonify({"error": "Missing required fields 'crossesId' or 'crossesTension'"}), 400
    
    # change to all fields being required??
    orderId = data.get('orderId')
    racketId = userId = mainsId = mainsTension = crossesId = crossesTension = orderDue = price = None
    if 'racketId' in data:
        racketId = data.get('racketId')
    if 'userId' in data:
        userId = data.get('userId')
    if 'mainsId' in data:
        mainsId = data.get('mainsId')
    if 'mainsTension' in data: 
        mainsTension = data.get('mainsTension')
    if 'crossesId' in data: 
        crossesId = data.get('crossesId')
    if 'crossesTension' in data:
        crossesTension = data.get('crossesTension')
    if 'orderDue' in data:
        dateString = data.get('orderDue')
        orderDue = datetime.strptime(dateString, '%Y-%m-%d').date()
    if 'price' in data:
        price = data.get('price')

    try:
        order = db.session.get(Order, orderId)
        if racketId: # TODO: validate these ID's
            order.racketId = racketId
        if userId:
            order.userId = userId
        if sameForCrosses:
            for record in order.strungWithRecords:
                if record.direction == None or record.direction == 'mains':
                    record.direction = None
                    if mainsId:
                        string = db.session.get(String, mainsId)
                        if not string:
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
                                return jsonify({"error": "String does not exist"}), 404
                            record.string = mains
                        if mainsTension:
                            record.tension = mainsTension
                    else:
                        if crossesId:
                            crosses = db.session.get(String, crossesId)
                            if not crosses:
                                return jsonify({"error": "String does not exist"}), 404
                            record.string = crosses
                        if crossesTension:
                            record.tension = crossesTension
            else:
                mainsStrungWith = order.strungWithRecords[0]
                if mainsId:
                    mains = db.session.get(String, mainsId)
                    if not mains:
                        return jsonify({"error": "String does not exist"}), 404
                    mainsStrungWith.string = mains
                if mainsTension:
                    mainsStrungWith.tension = mainsTension
                
                crossesStrungWith = None
                if crossesId and crossesTension:
                    crosses = db.session.get(String, crossesId)
                    if not crosses:
                        return jsonify({"error": "String does not exist"}), 404
                    try:
                        crossesStrungWith = StrungWith(tension=crossesTension, direction="crosses", string=crosses)
                        order.strungWithRecords.append(crossesStrungWith)
                    except Exception as e:
                        return jsonify({"error": "Error creating crosses job details."}), 500
        
        if orderDue:
            order.due = orderDue

        if price:
            order.price = price

        db.session.commit()
        return jsonify({"message": "Order successfully updated", "order": order.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    

@app.route('/api/complete-order/<int:orderId>', methods=['PATCH'])
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

        print("Is complete:", order.complete)

        db.session.add(order)
        db.session.commit()

        return jsonify({"message": "Order complete field successfully toggled", "order": order.to_json()}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
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

    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
    
@app.route('/api/delete-order/<int:orderId>', methods=['DELETE'])
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

# @app.route('/api/brands/', defaults={'limit': None})
# @app.route('/api/brands/<int:limit>', methods=['GET'])
# def get_brands(limit: int):
#     """
#     Fetches brands from the database

#     Parameters:
#         - limit (int): limits the number of items returned by the databse
#     """
#     query = db.select(Brand).order_by(Brand.name.asc())

#     if limit is not None:
#         query = query.limit(limit)
        
#     try:
#         brands = db.session.execute(query).scalars().all()
#         return jsonify([b.to_json() for b in brands])
#     except OperationalError:
#         return jsonify([])


# @app.route('/api/get-brand-by-id/<int:brandId>', methods=['GET'])
# def get_brand_by_id(brandId: int):
#     """    
#     Fetches a brand from the database by its id.

#     Parameter:
#         - brandId (int): identifies the brand
#     """
#     brand = db.session.get(Brand, brandId)
#     if brand: 
#         return jsonify(brand.to_json())
#     return jsonify({"error": "Brand not found"}), 404


@app.route('/api/create-brand', methods=['POST'])
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
    existingBrand = db.session.execute(db.select(Brand).filter_by(name=name)).first()
    if existingBrand:
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
    

@app.route('/api/update-brand', methods=['POST'])
def update_brand():
    """    
    Updates a brand.

    Expected JSON Format:
    {
        'brandId': brandId,
        'name': name
    }
    """

    data = request.get_json()

    if not data or "brandId" not in data:
        return jsonify({"error": "Missing data or required field 'brandId'"}), 400
    
    # change to all fields being required??
    brandId = data.get('brandId')
    name = None
    if 'name' in data:
        name = data.get('name')

    try:
        brand = db.session.get(Brand, brandId)
        if name:
            brand.name = name
    
        db.session.commit()
        return jsonify({"message": "Brand successfully updated", "brand": brand.to_json()}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500
    
    
@app.route('/api/delete-brand/<int:brandId>', methods=['DELETE'])
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

# @app.route('/api/inquiries/', defaults={'limit': None})
# @app.route('/api/inquiries/<int:limit>', methods=['GET'])
# def get_inquiries(limit: int):
#     """
#     Fetches inquiries from the database

#     Parameters:
#         - limit (int): limits the number of items returned by the databse
#     """
#     query = db.select(Inquiry).order_by(Inquiry.name.asc())

#     if limit is not None:
#         query = query.limit(limit)
        
#     try:
#         inquiries = db.session.execute(query).scalars().all()
#         return jsonify([b.to_json() for b in inquiries])
#     except OperationalError:
#         return jsonify([])
    

# @app.route('/api/get-inquiry-by-id/<int:inquiryId>', methods=['GET'])
# def get_inquiry_by_id(inquiryId: int):
#     """    
#     Fetches an inquiry from the database by its id.

#     Parameter:
#         - inquiryId (int): identifies the inquiry
#     """
#     inquiry = db.session.get(Inquiry, inquiryId)
#     if inquiry: 
#         return jsonify(inquiry.to_json())
#     return jsonify({"error": "inquiry not found"}), 404


@app.route('/api/create-inquiry', methods=['POST'])
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
    
@app.route('/api/delete-inquiry/<int:inquiryId>', methods=['DELETE'])
def delete_inquiry(inquiryId: int):
    """    
    Deletes an inquiry from the database by its id

    Parameter:
        - inquiryId (int): identifies the inquiry
    """
    
    inquiry = db.session.get(Inquiry, inquiryId)
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
    return jsonify({"error": "inquiry not found"}), 404



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
    pass

def create_racket(body):
    pass

def create_string(body):
    pass

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
    email = body.get('email') # TODO: email validatoin
    phone = None
    if 'phone' in body:
        phone = body.get('phone')

    # Checks for an existing user
    existingUser = db.session.execute(db.select(User).filter_by(username=username)).scalar_one_or_none()
    if existingUser:
        return jsonify({"error": "A user with this username already exists"}), 409

    try:
        user = User(username=username, firstName=firstName, lastName=lastName, email=email, phone=phone)
        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User successfully created", "user": user.to_json()}), 201
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A user with this username already exists"}), 409
    
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "An internal error has occurred."}), 500

def create_brand(body):
    pass

def create_inquiry(body):
    pass

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
    pass

def update_racket(id, body):
    pass

def update_string(id, body):
    pass

def update_user(id, body):
    pass

def update_brand(id, body):
    pass

def update_inquiry(id, ody):
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
    pass

def delete_racket(id):
    pass

def delete_string(id):
    pass

def delete_user(id):
    pass

def delete_brand(id):
    pass

def delete_inquiry(id):
    pass

DELETE_HANDLERS = {
    'orders': delete_order,
    'rackets': delete_racket,
    'strings': delete_string,
    'users': delete_user,
    'brands': delete_brand,
    'inquiries': delete_inquiry
}


@app.route('/api/<str:table>', methods=['GET'])
def get_entries(table: str):
    handler = LIST_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404
    return handler()


@app.route('/api/<str:table>/<int:id>', methods=['GET'])
def get_entry(table: str, id: int):
    handler = ENTRY_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404
    return handler(id)

@app.route("/api/<str:table>", methods=["PUT"])
def create_entry(table: str):
    handler = CREATE_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404
    
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Missing request body"}), 400
    
    return handler(body)

@app.route("/api/<str:table>/<int:id>", methods=["POST"])
def update_entry(table: str, id: int):
    handler = UPDATE_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Missing request body"}), 400

    return handler(id, body)

@app.route("/api/<str:table>/<int:id>", methods=["DELETE"])
def delete_entry(table: str, id: int):
    handler = DELETE_HANDLERS.get(table)
    if handler is None:
        return jsonify({"error": "Unknown table"}), 404

    return handler(id)


@app.route('/api/<table>/page', methods=['POST'])
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