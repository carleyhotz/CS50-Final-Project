from flask import jsonify
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
    highscore = 0
    if session.get("user_id"):
        rows = db.execute("SELECT highscore FROM scores WHERE user_id = ? AND game = '2048'", session["user_id"])
        if rows:
            highscore = rows[0]["highscore"]
        else:
            # If no score exists, insert a row for this user/game
            db.execute("INSERT INTO scores (user_id, game, highscore) VALUES (?, ?, ?)", session["user_id"], "2048", 0)
    return render_template("2048.html", highscore=highscore)


# Route to update 2048 highscore
@app.route("/update_2048_highscore", methods=["POST"])
def update_2048_highscore():
    if not session.get("user_id"):
        return jsonify(success=False), 403
    data = request.get_json()
    new_score = data.get("score")
    if new_score is None:
        return jsonify(success=False), 400
    # Get current highscore
    rows = db.execute("SELECT highscore FROM scores WHERE user_id = ? AND game = '2048'", session["user_id"])
    if rows:
        if new_score > rows[0]["highscore"]:
            db.execute("UPDATE scores SET highscore = ? WHERE user_id = ? AND game = '2048'", new_score, session["user_id"])
            return jsonify(success=True)
        else:
            return jsonify(success=True)  # No update needed, but still success
    else:
        db.execute("INSERT INTO scores (user_id, game, highscore) VALUES (?, ?, ?)", session["user_id"], "2048", new_score)
        return jsonify(success=True)


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


