from db import db

class Owns(db.Model):
    """
        TODO: relationships
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
    
    rackets = db.relationship('Owns', back_populates='user')
    orders = db.relationship('Order', back_populates='user')

    def to_json(self):
        return {
            "id": self.id, 
            "username": self.username,
            "rackets": [r.to_json() for r in self.rackets], # backend does the work because we already defined the relationship
            "orders": [o.to_json() for o in self.orders]
        }

class StrungWith(db.Model):
    """
 
    """
    __tablename__ = "strung_with"
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    string_id = db.Column(db.Integer, db.ForeignKey('strings.id'))
    
    tension = db.Column(db.Integer, nullable=False)
    direction = db.Column(db.String(7), nullable=True)

    strings = db.relationship("String", back_populates="order_records")
    order = db.relationship("Order", back_populates="strung_with_records")

    def to_json(self):
        return {
            "id": self.id, 
            "order_id": self.order_id, 
            "string_id": self.string_id,
            "tension": self.tension,
            "direction": self.direction
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
    # Relationship: one to many
    orders = db.relationship('Order', back_populates='racket')
    users = db.relationship('Owns', back_populates='racket')

    def to_json(self):
        return {
            "id": self.id, 
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
    # Foreign Key
    racket_id = db.Column(db.Integer, db.ForeignKey('rackets.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # Relation ship: many to one
    user = db.relationship('User', back_populates='orders')
    racket = db.relationship('Racket', back_populates='orders')

    strung_with_records = db.relationship('StrungWith', back_populates='order')

    def to_json(self):
        return {
            "id": self.id, 
            "orderDate": self.orderDate.isoformat() if self.orderDate else None, 
            "due": self.due if self.due else None,
            "price": self.price,
            "complete": self.complete,
            "racket_name": self.racket.name if self.racket else None,
            "job_details": [
                {
                    "string_name": record.strings.name, 
                    "tension": record.tension,         
                    "direction": record.direction      
                } 
                for record in self.strung_with_records
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

    order_records = db.relationship('StrungWith', back_populates='strings')

    def to_json(self):
        return {"id": self.id, "name": self.name, "price_per_racket": self.price_per_racket}


