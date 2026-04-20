from flask import Flask, render_template

app = Flask(__name__)

# HOME (Login Page)
@app.route("/")
def home():
    return render_template("index.html")


# DASHBOARD
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# TASK
@app.route("/task")
def task():
    return render_template("task.html")


# TIMER
@app.route("/timer")
def timer():
    return render_template("timer.html")


# MENTORSHIP
@app.route("/mentorship")
def mentorship():
    return render_template("mentorship.html")


# UPSC
@app.route("/upsc")
def upsc():
    return render_template("upsc.html")


# UPPCS
@app.route("/uppcs")
def uppcs():
    return render_template("uppcs.html")


# CURRENT AFFAIRS
@app.route("/current")
def current():
    return render_template("current.html")


# AI PAGE
@app.route("/ai")
def ai():
    return render_template("ai.html")


# ABOUT
@app.route("/about")
def about():
    return render_template("about.html")


# RUN SERVER
if __name__ == "__main__":
    app.run(debug=True)


# DB CREATING

import sqlite3

def init_db():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        phone TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()


#Signup route

from flask import request, redirect

@app.route("/siup", methods=["POST"])
def signup():
    data = request.json

    name = data.get("name", "").strip()
    age = int(data.get("age", 0))
    phone = data.get("phone", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    # ✅ VALIDATION
    if len(name) < 3:
        return {"status": "error", "message": "Name must be at least 3 characters"}

    if age < 15 or age > 60:
        return {"status": "error", "message": "Invalid age"}

    if len(phone) != 10 or not phone.isdigit():
        return {"status": "error", "message": "Invalid phone number"}

    if "@" not in email or "." not in email:
        return {"status": "error", "message": "Invalid email"}

    if len(password) < 6:
        return {"status": "error", "message": "Password too short"}

    # DB insert
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    try:
        cur.execute("""
        INSERT INTO users (name, age, phone, email, password)
        VALUES (?, ?, ?, ?, ?)
        """, (name, age, phone, email, password))

        conn.commit()
        return {"status": "success"}

    except:
        return {"status": "error", "message": "User already exists"}

    finally:
        conn.close()


#Login route

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email=? AND password=?",
                (data["email"], data["password"]))

    user = cur.fetchone()
    conn.close()

    if user:
        return {"status": "success"}
    else:
        return {"status": "error", "message": "Invalid credentials"}



#dhuaosfh

from flask import request

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    return {"status": "success"}



