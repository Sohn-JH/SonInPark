from flask import Flask
from flask_mongoengine import MongoEngine
from config import DBConfig

app = Flask(__name__, static_folder="./static/dist", template_folder="./static")
app.config.from_object(DBConfig)
db = MongoEngine(app)

