from mongoengine import *
from flask import jsonify

class AvailableLecture(EmbeddedDocument) :
    lecture_id = StringField(required=True)
    expire_date = StringField(required=True)


class Users(Document) :
    user_id = IntField(required=True)
    nickname = StringField()
    avail_lectures = ListField(EmbeddedDocumentField(AvailableLecture))

    @staticmethod
    def get_available_lectures(uid) :
        user = Users.objects(user_id=uid)[0]
        return user

    @staticmethod
    def update_available_lectures(uid, lecture_list) :
        Users.objects(user_id=uid).update(avail_lectures=lecture_list)

    @staticmethod
    def get_all_users() :
        all_users = Users.objects()
        user_dict_list = []

        for user in all_users :
            user_dict = { "user_id" : user["user_id"], "nickname" : user["nickname"] }
            user_dict_list.append(user_dict)
        return user_dict_list

    @staticmethod
    def is_exists(uid) :
        if Users.objects(user_id=uid) :
            return True
        else :
            return False

    @staticmethod
    def insert_user(uid, nickName) :
        user = Users(user_id=uid, nickname=nickName)
        user.save()

class Video(EmbeddedDocument) :
    lecture_id = StringField(required=True)
    title = StringField(required=True)
    url = URLField(required=True)

class Videos(Document) :
    math = ListField(EmbeddedDocumentListField(Video))
    physics = ListField(EmbeddedDocumentListField(Video))
    chemistry = ListField(EmbeddedDocumentListField(Video))
    biology = ListField(EmbeddedDocumentListField(Video))

    @staticmethod
    def get_videos() :
        videos = Videos.objects()
        return videos
