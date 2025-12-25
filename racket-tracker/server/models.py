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

    string = db.relationship("String")

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
    ordered_on = db.Column(db.Date, nullable=False)
    due_on = db.Column(db.Date, nullable=False)
    price = db.Column(db.Float, nullable=False)
    # Foreign Key
    racket_id = db.Column(db.Integer, db.ForeignKey('rackets.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # Relation ship: many to one
    user = db.relationship('User', back_populates='orders')
    racket = db.relationship('Racket', back_populates='orders')
    strings = db.relationship('String', secondary=StrungWith.__table__, back_populates='orders')
    # Stop at middle man
    strung_with_records = db.relationship('StrungWith', backref='order')

    def to_json(self):
        return {
            "id": self.id, 
            "ordered_on": self.ordered_on.isoformat() if self.ordered_on else None, 
            "due_on": self.due_on if self.due_on else None,
            "price": self.price,
            "racket_name": self.racket.name if self.racket else None,
            "job_details": [
                {
                    "string_name": record.string.name, # Jump from middle -> string to get name
                    "tension": record.tension,         # Get data from middle
                    "direction": record.direction      # Get data from middle
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
    orders = db.relationship('Order', secondary=StrungWith.__table__, back_populates='strings')

    def to_json(self):
        return {"id": self.id, "name": self.name, "price_per_racket": self.price_per_racket}


