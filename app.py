from flask import Flask, render_template, request, redirect, session, abort
from werkzeug.security import check_password_hash, generate_password_hash
from cs50 import SQL

app = Flask(__name__)

app.secret_key = "cs50finalproject"

db = SQL("sqlite:///games.db")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/2048")
def G_2048():
    return render_template("2048.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    # Forget any user_id
    session.clear()  

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            abort(400)

        # Ensure password was submitted
        elif not request.form.get("password"):
            abort(400)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1:
            abort(401)
        if not check_password_hash(rows[0]["hash"], request.form.get("password")):
            abort(401)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            abort(400)

        # Ensure password was submitted
        elif not request.form.get("password"):
            abort(400)

        # Ensure password was confirmed
        elif not request.form.get("confirmation"):
            abort(400)

        # Ensure password and confirmed password match
        elif request.form.get("password") != request.form.get("confirmation"):
            abort(400)

        # Hash password
        hashed_password = generate_password_hash(request.form.get("password"))

        # Insert username and password into db
        try:
            db.execute("INSERT INTO users (username, hash) VALUES (?, ?)",
                       request.form.get("username"), hashed_password)
        # If username taken, apologize
        except ValueError:
            abort(400)

        # Log user in
        rows = db.execute("SELECT id FROM users WHERE username == ?", request.form.get("username"))
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("register.html")


@app.route("/logout")
def logout():
    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


