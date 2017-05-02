from flask import request, render_template, jsonify, url_for, redirect, g
from .models import Users, Videos
from index import app, db


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route('/api/user/<int:user_id>', methods=['GET', 'POST'])
def available_lecture(user_id):
    if request.method == 'GET' :
        print(user_id)
        avail_lectures = Users.get_available_lectures(user_id)
        return avail_lectures.to_json()
    elif request.method =='POST' :
        incoming = request.get_json()
        lecture_list = incoming["available"]
        Users.update_available_lectures(user_id, lecture_list)
        return jsonify(result="success")
    else :
        return 404


@app.route('/api/user/all', methods=['GET'])
def get_all_user_list() :
    users = Users.get_all_users()
    return jsonify(id_list=users)

@app.route('/api/user/login', methods=['POST'])
def login() :
    incoming = request.get_json()
    uid = incoming["id"]
    nickName = incoming["nickName"]
    if not Users.is_exists(uid) :
        Users.insert_user(uid, nickName)
    return jsonify(result="success")



@app.route('/api/videoList', methods=['GET'])
def get_videoList() :
    return Videos.get_videos().to_json()
