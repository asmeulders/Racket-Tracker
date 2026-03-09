# Racket Tracker
Keep track of customer orders in a clean efficient way. Easily access order history and previous job details!

### Features
- Streamlined dashboard for store owners
- Store order history in SQL database
- Customers can inquire about a service from the website

## Overview
I am a CS student at BU and an avid tennis player with my own racket stringing business. For the longest time I was using a simple spreadsheet to manage my business but one day I decided to try and make life easier for me and make my own application to manage my business. After working at a pro shop and running my own service, I knew I needed a simple way to access order histories and customer information, easily search and manage data, and a sleek webpage to handle it all. So I made Racket Tracker for myself and anyone else who runs their own stringing business!

### Authors
Alexander Smeulders - BA/MS in Computer Science at BU (27/28) @asmeulders

## Installation

### Prerequisites 
python3, nvm, nodejs, npm

```bash
# Clone Repo
git clone https://github.com/asmeulders/Racket-Tracker.git

# Frontend
cd racket-tracker/client
npm install
npm run dev

# Backend - In new terminal instance
cd racket-tracker/server
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt

python3 app.py
```

## Usage
When a customer drops off a racket, you can create a new customer profile for your shop along with their racket. Then, create an order with their racket, desired string, and other specifications. Once you complete the order it will send a message to the customer automatically saying it is complete!

## Notes
**Linux only:** If using a web server (eg. nginx, gunicorn), ensure the `instance/` directory and `store.db` file are owned by your web user (`www-data` on Debian/Ubuntu) with write access:
```bash
sudo chown www-data:www-data racket-tracker/server/instance
sudo chmod 775 racket-tracker/server/instance
sudo chown www-data:www-data racket-tracker/server/instance/store.db
sudo chmod 664 racket-tracker/server/instance/store.db
```

## Feedback and Contributing
I encourage anyone to open issues for bug/feature requests!

### License
MIT License
