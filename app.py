from flask import Flask

app = Flask(__name__)


# Comment
@app.route("/")
def index():
    return "hello, world"