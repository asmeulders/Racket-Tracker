from db import db

class Owns(db.Model):
    """
        TODO: 
        - properties
        - to_json
    """
    __tablename__ = "owns"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    racket_id = db.Column(db.Integer, db.ForeignKey('rackets.id'))

    def to_json(self):
        return {
            "id": self.id, 
            "user_id": self.user_id, 
            "racket_id": self.racket_id
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
    
    rackets = db.relationship('Racket', secondary=Owns.__table__, back_populates='users')
    orders = db.relationship('Order', back_populates='user')

    def to_json(self):
        return {
            "id": self.id, 
            "username": self.username,
            "rackets": [r.to_json() for r in self.rackets] # backend does the work because we already defined the relationship
        }

class StrungWith(db.Model):
    """
        TODO: how to get the tension and direction with one 
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
    users = db.relationship('User', secondary=Owns.__table__, back_populates='rackets')

    def to_json(self):
        return {"id": self.id, "name": self.name, "price": self.price}
    
    
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
        - to_json
    """
    __tablename__ = 'strings'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    price_per_racket = db.Column(db.Float, nullable=False)

    order_records = db.relationship('StrungWith', back_populates='strings')

    def to_json(self):
        return {"id": self.id, "name": self.name, "price_per_racket": self.price_per_racket}


