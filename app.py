from flask import Flask, render_template, request, redirect, session, jsonify
import sqlite3
import os
from openai import OpenAI

# ---------------- APP INIT ---------------- #
app = Flask(__name__)
app.secret_key = "supersecret123"

# OpenAI client (secure way)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ---------------- DB INIT ---------------- #
def init_db():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        gender TEXT,
        age INTEGER,
        phone TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT
    )''')

    # Chat history table
    c.execute('''CREATE TABLE IF NOT EXISTS chat(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        bot TEXT
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS mentorship(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT UNIQUE,
    exam TEXT,
    study_hours INTEGER,
    notify_time TEXT
)''')
    


    conn.commit()
    conn.close()

init_db()

# ---------------- HELPER ---------------- #
def save_chat(user, bot):
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute("INSERT INTO chat (user, bot) VALUES (?, ?)", (user, bot))
    conn.commit()
    conn.close()

# ---------------- PAGES ---------------- #

@app.route('/')
def home():
    return render_template("login.html")

@app.route('/register')
def register_page():
    return render_template("register.html")

@app.route('/dashboard')
def dashboard():
    if "user" in session:
        return render_template("dashboard.html", user=session["user"])
    return redirect('/')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

# ---------------- OTHER PAGES ---------------- #

@app.route("/task")
def task_page():
    return render_template("task.html")

@app.route("/timer")
def timer():
    return render_template("timer.html")

@app.route("/mentorship")
def mentorship():
    if "user" not in session:
        return redirect("/")

    user = session["user"]

    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("SELECT * FROM mentorship WHERE user=?", (user,))
    data = c.fetchone()

    conn.close()

    return render_template("mentorship.html", data=data)

# mentorship page reg

@app.route("/save_preferences", methods=["POST"])
def save_preferences():
    if "user" not in session:
        return redirect("/")

    user = session["user"]
    exam = request.form["exam"]
    hours = request.form["study_hours"]
    notify = request.form["notify_time"]

    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("""
        INSERT INTO mentorship (user, exam, study_hours, notify_time)
        VALUES (?, ?, ?, ?)
    """, (user, exam, hours, notify))

    conn.commit()
    conn.close()

    return redirect("/mentorship")

# mentorship delete
@app.route("/delete_mentorship", methods=["POST"])
def delete_mentorship():
    if "user" not in session:
        return redirect("/")

    user = session["user"]

    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("DELETE FROM mentorship WHERE user=?", (user,))
    conn.commit()
    conn.close()

    return redirect("/mentorship")

#reset mentorship

@app.route("/reset_mentorship", methods=["POST"])
def reset_mentorship():
    return redirect("/mentorship")



@app.route("/upsc")
def upsc():
    return render_template("upsc.html")

@app.route("/uppcs")
def uppcs():
    return render_template("uppcs.html")

@app.route("/current")
def current():
    return render_template("current.html")

@app.route("/ai")
def ai():
    return render_template("ai.html")

@app.route("/chat")
def chat_page():
    return render_template("chat.html")

@app.route("/about")
def about():
    return render_template("about.html")

# ---------------- AUTH API ---------------- #

@app.route('/register_user', methods=['POST'])
def register_user():
    data = request.json

    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("SELECT * FROM users WHERE email=? OR phone=?",
              (data['email'], data['phone']))
    user = c.fetchone()

    if user:
        conn.close()
        return jsonify({"status": "exists"})

    c.execute("INSERT INTO users(name, gender, age, phone, email, password) VALUES(?,?,?,?,?,?)",
              (data['name'], data['gender'], int(data['age']), data['phone'], data['email'], data['password']))

    conn.commit()
    conn.close()

    return jsonify({"status": "success"})


@app.route('/login_user', methods=['POST'])
def login_user():
    data = request.json

    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("SELECT email, name FROM users WHERE (email=? OR phone=?) AND password=?",
              (data['login'], data['login'], data['password']))

    user = c.fetchone()

    if user:
        session["user"] = user[0]   # अब user[0] = email है ✅
        conn.close()
        return jsonify({"status": "success"})

    c.execute("SELECT * FROM users WHERE email=? OR phone=?",
              (data['login'], data['login']))
    exist = c.fetchone()

    conn.close()

    if exist:
        return jsonify({"status": "wrong"})
    else:
        return jsonify({"status": "not_exist"})


@app.route('/forgot', methods=['POST'])
def forgot():
    data = request.json

    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("UPDATE users SET password=? WHERE email=? OR phone=?",
              (data['new_password'], data['login'], data['login']))

    conn.commit()
    conn.close()

    return jsonify({"status": "updated"})

# ---------------- GPT CHAT API ---------------- #

@app.route("/chat_api", methods=["POST"])
def chat_api():
    data = request.json
    user_msg = data.get("message")

    if not user_msg:
        return jsonify({"reply": "Empty message"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a UPSC mentor. "
                        "Answer in Hindi + English mix. "
                        "Be structured, helpful, and motivational."
                    )
                },
                {"role": "user", "content": user_msg}
            ]
        )

        reply = response.choices[0].message.content

        save_chat(user_msg, reply)

        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"}), 500
    


# ---------------- RUN ---------------- #
if __name__ == "__main__":
    app.run(debug=True)