import face_recognition
import cv2
import uuid
import numpy as np
import os
from flask import *
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, storage
from firebase_admin import db

p = 0

app = Flask(__name__)
CORS(app)
cred = credentials.Certificate("service.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'face-recognition-d3e7d.appspot.com',
    'databaseURL': 'https://face-recognition-d3e7d-default-rtdb.firebaseio.com'
})
db_ref = db.reference("register")
known_path = os.path.join(os.getcwd(), "Images/Known_faces/")
unknown_path = os.path.join(os.getcwd(), "Images/Unknown_faces/")

def upload_image_to_storage(name, path):
    bucket = storage.bucket()
    blob = bucket.blob(name)
    blob.upload_from_filename(path)
    # Make the image URL public so that it can be accessed from anywhere
    blob.make_public()
    return blob.public_url

def get_data():
    db = db_ref.get()
    data = []
    if db:
        for key in db:
            l = []
            l.append(key)
            string = db[key]["encoding"]
            nums = []
            strings = string[1:len(string)-2]
            for x in strings.split(' '):
                if x=="":
                    pass
                else:
                    nums.append(float(x.strip()))
            l.append(nums)
            data.append(l)
    return data

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/register', methods=['GET'])
def register():
    name = request.args.get("name")
    video_capture = cv2.VideoCapture(0)
    ret, frame = video_capture.read()
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    rgb_small_frame = small_frame[:, :, ::-1]
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
    dir = os.path.join(known_path,name)
    if(not os.path.isdir(dir)):
        os.mkdir(dir)
    os.chdir(dir) 
    rand_no = np.random.random_sample()
    cv2.imwrite(str(rand_no)+".jpg", frame)
    video_capture.release()
    cv2.destroyAllWindows()
    encoding = ""
    for i in face_encodings:
        encoding += str(i)+","
    data = {
        "encoding": encoding
    }
    db_ref.child(name).set(data)
    if(data["encoding"]==""):
        register()
    p = 0
    return ["Done", p, 0]

@app.route("/login")
def login():
    names = ""
    url = ""
    db = get_data()
    if(db == []):
        msg = "You are unknown first register your self"
    else:
        known_face_encodings = [i[1] for i in db]
        known_face_names = [i[0] for i in db]
        face_locations = []
        face_encodings = []
        face_names = []
        video_capture = cv2.VideoCapture(0)
        ret, frame = video_capture.read()
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = small_frame[:, :, ::-1]
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        face_names = []
        if(face_encodings == []):
            msg = "You are unknown first register your self"
        else:
            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Unknown"
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]
                if(name == "Unknown"):
                    msg = "You are unknown first register your self"
                else:
                    msg = name
                face_names.append(name)
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)
            bucket_name = "face-recognition-d3e7d.appspot.com"
            names = str(uuid.uuid4()) + '.jpg'
            path = os.path.join(unknown_path, names)
            cv2.imwrite(path, frame)
            url = upload_image_to_storage(names, path)
    p = 1
    return [msg, p, url]

if __name__ == '__main__':
    app.run(debug=True)