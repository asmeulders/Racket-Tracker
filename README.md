# Racket Tracker
A web app that helps you keep track of customer orders for your racket stringing business. 

### Features
- User login
- Store a database of users, rackets, strings, and orders
- Copmlete orders on the store page
- Customers can create new orders on the website

## Installation
Clone the repo

need nvm, nodejs, npm
go to client and do npm install
use python3
make a venv in server
pip install flask, flask_sqlalchemy, flask_cors, 

## Setup
on linux make sure the instance directory and the store.db file has the right perms

# Change ownership to the web user (adjust 'www-data' to your specific user if different)
sudo chown www-data:www-data /path/to/your/app/instance
sudo chown www-data:www-data /path/to/your/app/instance/app.db

# Give the owner and group write access
sudo chmod 664 /path/to/your/app/instance/app.db
sudo chmod 775 /path/to/your/app/instance

## Usage
When a customer drops off a racket, you can create a new customer profile for your shop along with their racket. Then, create an order with their racket, desired string, and other specifications. Once you complete the order it will send a message to the customer automatically saying it is complete!

### License
MIT License
