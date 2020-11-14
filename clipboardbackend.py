import flask
import flask_login
from google.oauth2 import id_token
from google.auth.transport import requests
from flask import request, jsonify
import os.path
import os

app = flask.Flask(__name__)

# Pretty sure much of the security is offloaded to google. So this doesn't do
# much. But for safety I've initialized it to a random value. A sign-in session
# doesn't break when this value changes, so I guess it's not really being used
# here. https://flask.palletsprojects.com/en/1.0.x/quickstart/#sessions
app.secret_key = os.urandom(16)

clipboard_dir = '/var/clipboard/'
login_manager = flask_login.LoginManager()
login_manager.init_app(app)
app.config["DEBUG"] = False

# This is my CLIENT_ID. Change this to point to your own. Google documentation:
# https://developers.google.com/identity/protocols/oauth2
#
# I've read the documentation linked above and can't find a good reason not to
# share my CLIENT_ID. If there is a good reason I missed, please let me know.
CLIENT_ID = "720348569205-min9hsnohjk2711d85hpueak8oc7peuh.apps.googleusercontent.com" 

class User(flask_login.UserMixin):
    pass

@login_manager.user_loader
def user_loader(uid):
    user = User()
    user.id = uid
    return user

@app.route('/', methods=['GET'])
def home():
        return "<h1>Clipboard backend server/h1><p>Please go to clipboard.waltersmuts.com/p>"

@app.route('/backend/sign-in', methods=['POST'])
def api_all():
    print(request.form)
    token = request.form['idtoken']
    idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
    if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
        raise ValueError('Wrong issuer.')
        
    try:
        clipboard = open(clipboard_dir + idinfo["sub"], "r").read()
    except:
        clipboard = "Your clipboard is empty!"
    user = User()
    user.id = idinfo["sub"]
    flask_login.login_user(user)
    return clipboard

@app.route('/backend/save', methods=['POST'])
@flask_login.login_required
def save():
    print(request.form)
    clipboard = open(clipboard_dir + flask_login.current_user.id, "w")
    clipboard.write(request.form['clipboard'])
    clipboard.close()
    return 'Logged in as: ' + flask_login.current_user.id

@login_manager.unauthorized_handler
def unauthorized_handler():
    return 'Unauthorized'
