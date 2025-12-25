from db import db

class Racket(db.Model):
    __bind_key__ = 'rackets_db'  # Links to the key in SQLALCHEMY_BINDS
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)

    def to_json(self):
        return {"id": self.id, "name": self.name, "price": self.price}