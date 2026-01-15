from db import db
from sqlalchemy import event

class Owns(db.Model):
    """

    """
    __tablename__ = "owns"
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    racket_id = db.Column(db.Integer, db.ForeignKey('rackets.id'), primary_key=True)

    quantity = db.Column(db.Integer, nullable=False)

    user = db.relationship("User", back_populates="rackets")
    racket = db.relationship("Racket", back_populates="users")

    def to_json(self):
        return {
            "racket_id": self.racket.id, 
            "racket_brand": self.racket.brand.name if self.racket and self.racket.brand else None,
            "racket_name": self.racket.name,
            "quantity": self.quantity
        }

class User(db.Model):
    """
        TODO: 
        - Add phone number and email
        - Admin vs customer
    """
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    
    rackets = db.relationship('Owns', back_populates='user', cascade="all, delete-orphan")
    orders = db.relationship('Order', back_populates='user')

    def to_json(self):
        return {
            "id": self.id, 
            "username": self.username,
            "rackets": [r.to_json() for r in self.rackets],
            "orders": [o.to_json() for o in self.orders] 
        }

class StrungWith(db.Model):
    """
    TODO: Want this to stay with snapshotting when the string is deleted=============== 
    """
    __tablename__ = "strung_with"
    # Surrogate key
    id = db.Column(db.Integer, primary_key=True)
    # Foreign Keys
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    string_id = db.Column(db.Integer, db.ForeignKey('strings.id' , ondelete='SET NULL'), nullable=True)
    # Extra data
    tension = db.Column(db.Integer, nullable=False)
    direction = db.Column(db.String(7), nullable=True)
    # Snapshot data
    snapshot_string_name = db.Column(db.String(100))

    string = db.relationship("String", back_populates="order_records")
    order = db.relationship("Order", back_populates="strung_with_records")

    def to_json(self):
        return {
            "id": self.id, 
            "order": self.order.to_json(), 
            "string": self.string.to_json() if self.string else None,
            "tension": self.tension,
            "direction": self.direction,
            "snapshot_string_name": self.snapshot_string_name
        }
    
class Racket(db.Model):
    """
        TODO: 
        - Add specs
    """
    __tablename__="rackets"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    # FKs
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id', ondelete='SET NULL'), nullable=True)
    # Relationships
    orders = db.relationship('Order', back_populates='racket')
    users = db.relationship('Owns', back_populates='racket', cascade="all, delete-orphan")
    brand = db.relationship('Brand', back_populates='rackets')

    def to_json(self):
        return {
            "id": self.id, 
            "brand_name": self.brand.name if self.brand else None,
            "name": self.name, 
            "price": self.price,
            "orders": [o.to_json() for o in self.orders],
            "owners": [
                {
                    "user_id": u.user.id,
                    "username": u.user.username,
                    "quantity": u.quantity
                } for u in self.users
            ],
        }
    
    
class Order(db.Model):
    """

    """
    __tablename__="orders"
    id = db.Column(db.Integer, primary_key=True)
    orderDate = db.Column(db.Date, nullable=False)
    due = db.Column(db.Date, nullable=False)
    price = db.Column(db.Float, nullable=False)
    complete = db.Column(db.Boolean, nullable=False)
    paid = db.Column(db.Boolean, nullable=False)
    # Snapshot data
    snapshot_name = db.Column(db.String(50), nullable=False)
    snapshot_racket_name = db.Column(db.String(50), nullable=False)
    # snapshot_mains_name = db.Column(db.String(50), nullable=False)
    # snapshot_mains_tension = db.Column(db.Integer, nullable=False)
    # snapshot_crosses_name = db.Column(db.String(50), nullable=True)
    # snapshot_crosses_tension = db.Column(db.Integer, nullable=True)
    # Foreign Keys
    racket_id = db.Column(db.Integer, db.ForeignKey('rackets.id', ondelete='SET NULL'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    # Relationship
    user = db.relationship('User', back_populates='orders')
    racket = db.relationship('Racket', back_populates='orders')

    strung_with_records = db.relationship('StrungWith', back_populates='order', cascade="all, delete-orphan")

    def to_json(self):
        return {
            "id": self.id, 
            "order_date": self.orderDate.isoformat() if self.orderDate else None, 
            "due": self.due if self.due else None,
            "price": self.price,
            "complete": self.complete,
            "paid": self.paid,
            "user_name": self.user.username if self.user else None,
            "racket_brand": self.racket.brand.name if self.racket and self.racket.brand else None,
            "racket_name": self.racket.name if self.racket else None,
            # =========================================
            # Make string_name a snapshop
            # =========================================
            "job_details": [
                {
                    "string_name": record.string.name if record.string else None, 
                    "string_brand": record.string.brand.name if record.string and record.string.brand else None,
                    "tension": record.tension,         
                    "direction": record.direction      
                } 
                for record in self.strung_with_records
            ],
            "snapshot_data": [
                {
                    "snapshot_name": self.snapshot_name,
                    "snapshot_racket_name": self.snapshot_racket_name,
                    # "snapshot_job_details": [
                    #     {
                    #         "mains_name": self.snapshot_mains_name,
                    #         "mains_tension": None, 
                    #         "crosses_name": self.snapshot_crosses_name if self.snapshot_crosses_name else None,
                    #         "crosses_tension": None,
                    #     }
                    # ]
                }
            ]
        }

class String(db.Model):
    """
        TODO: 
        - specs
    """
    __tablename__ = 'strings'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    price_per_racket = db.Column(db.Float, nullable=False)
    # FKs
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id', ondelete='SET NULL'), nullable=True)
    # Relationships
    order_records = db.relationship('StrungWith', back_populates='string')
    brand = db.relationship('Brand', back_populates='strings')

    def to_json(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "price_per_racket": self.price_per_racket,
            "brand_name": self.brand.name if self.brand else None
        }


class Brand(db.Model):
    """
    Brand names for products
    """
    __tablename__ = "brands"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    # Relationships
    strings = db.relationship('String', back_populates='brand')
    rackets = db.relationship('Racket', back_populates='brand')

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "string_names": [
                {
                    "string_name": string.name,
                    "price_per_racket": string.price_per_racket
                } for string in self.strings 
            ],
            "racket_names": [
                {
                    "racket_name": racket.name,
                    "price": racket.price
                } for racket in self.rackets 
            ]
        }
    
class Inquiry(db.Model):
    """
    Docstring for Inquiry
    """
    __tablename__ = "inquiries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.String(200), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "message": self.message
        }
    
# ===================================================================
# --------Create Snapshot Data---------------------------------------
# ===================================================================

@event.listens_for(Order, 'before_insert')
def snapshot_user_data(mapper, connection, target):
    """
    mapper: The class mapper (rarely used here)
    connection: The DB connection (rarely used here)
    target: The actual instance being saved (The Order object)
    """
    
    if target.user:
        target.snapshot_name = target.user.username
        target.snapshot_racket_name = target.racket.name
        # for record in target.strung_with_records:
        #     if record.direction == "crosses":
        #         target.snapshot_crosses_name = record.string.name
        #         target.snapshot_crosses_tension = record.tension
        #     else:
        #         target.snapshot_mains_name = record.string.name
        #         target.snapshot_mains_tension = record.tension
            
        print(f"DEBUG: Snapshotted data for {target.snapshot_name}")

@event.listens_for(StrungWith, 'before_insert')
def snapshot_enrollment_data(mapper, connection, target):
    if target.string:
        target.snapshot_string_name = target.string.name
        print(f"DEBUG: Saved snapshot for {target.string.name}")