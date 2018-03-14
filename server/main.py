from flask import Flask, session, jsonify, request
import pymongo
from bson.objectid import ObjectId
from flask_cors import CORS
import twilio.rest
from twilio.twiml.voice_response import VoiceResponse
from time import strftime
from datetime import datetime
from requests.models import Response
import betterdoctor
import json
import random
import math
import os.path
from bson import BSON
from bson import json_util


TWILIO_ACCOUNT_SID = ""
TWILIO_AUTH_TOKEN = ""
TWILIO_PHONE_NUMBER = ""

TEMPLATE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "client/build/index.html")
STATIC_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "client/build/static")
TEMPLATE = open(TEMPLATE_PATH, "r").read()

app = Flask(__name__, static_folder=STATIC_PATH)
CORS(app)
client = pymongo.MongoClient()
db = client['healix']

twilio_client = twilio.rest.Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@app.route('/')
@app.route('/signup')
@app.route('/signin')
@app.route('/search')
@app.route('/home')
@app.route('/search/result')
@app.route('/doctor/details')
def hello():
    test= 32
    # return '<h1>Hello world!</h1>'
    db['test'].insert_one({'test': test})
    return TEMPLATE

@app.route("/api/search", methods = ['POST'])
def search():
    bodyData = None
    try:
        bodyData = json.loads(request.data)
    except json.JSONDecodeError:
        return "invalid JSON", 400
    name = None
    location = None
    specUID = None
    page = None
    if "location" in bodyData:
        location = bodyData["location"]
    else:
        return "location is required", 400
    if "name" in bodyData:
        name = bodyData["name"]
    if "specialty" in bodyData:
        specUID = bodyData["specialty"]
    if "page" in bodyData:
        try:
            page = int(bodyData["page"])
        except ValueError:
            return "page must be number", 400
    else:
        page = 0

    # Insurance will be None if the user has none.
    doctorData = betterdoctor.getDoctors("975eb48667ccb9eb20008d302685981d",
                                         name=name, location=location,
                                         specialty=specUID,
                                         skip=page)
    doctorList = []
    for doctor in doctorData["data"]:
        practice, phone = getSinglePracticeAndPhone(doctor["practices"])
        if practice is None and phone is None:
            continue
        doctorDict = {}
        doctorDict["profile"] = doctor["profile"]
        doctorDict["practice"] = practice
        doctorDict["phone"] = phone
        doctorDict["visit_address"] = practice["visit_address"]
        doctorDict["uid"] = doctor["uid"]
#        availableTime = getAvailableTime(doctorDict["uid"])
#        cursor = db.doctor.find_one({'doctorUid': doctorDict["uid"]})
#        doctorDict["range"] = cursor["range"]
#        doctorDict["availableTime"] = cursor["availableTime"]
        doctorList.append(doctorDict)

    return json.dumps(doctorList)


# Returns at most one practice with one phone number.
# Returns None if practices is not an appropriate candidate
def getSinglePracticeAndPhone(practices):
    if len(practices) == 0 or len(practices[0]["phones"]) == 0:
        return (None, None)
    practice = practices[0]
    practice_phone = None
    for phone in practice["phones"]:
        if phone["type"] == "landline" or phone["type"] == "business_landline":
            practice_phone = phone
            break
    if practice_phone is None:
        return (None, None)
    del practice["phones"]
    return (practice, practice_phone)

#@app.route('/api/getAvailableTime', methods=['GET'])
#def getAvailableTime(doctorUid=None):
#    cursor = db.doctor.find_one({'doctorUid': doctorUid})
#    if cursor is None:
#        start = random.uniform(9,13) # Generate start time from 9 to 13.
#        duration = random.uniform(4,7) # Generate how long they work
#        timeRange = [int(start), int(start)+int(duration)] # [startTime, endTime]
#        # Randomize for each day
#        availableTime = [int(start)]
#        # This loop divides duration into 30 miniutes
#        for k in range(1, int(duration) * 2):
#            rand = random.uniform(0,1)
#            if rand > 0.8:
#                availableTime.append(int(start)+k/2)
#        if availableTime == []:
#            timeRange = []
#        db.doctor.insert({'doctorUid': doctorUid,
#                          'range': timeRange,
#                          'availableTime': availableTime})
#        return jsonify(availableTime=availableTime)
#    return json.dumps({ 'times': cursor['availableTime']})

@app.route('/api/makeAppointment', methods = ['POST'])
def makeAppointment():
    # TODO: Insert appointment info into database
    bodyData = None
    try:
        bodyData = json.loads(request.data)
    except json.JSONDecodeError:
        return "invalid JSON", 400
    doctorUID = bodyData["doctorUid"]
    timeframe = bodyData["timeframe"]
    doctorName = bodyData['doctorName']
    db.appointment.insert({"doctorUid": doctorUID, "userId": session['userId'], "timeframe": timeframe})
    cursor = db.appointment.find_one({"doctorUid": doctorUID, "timeframe": timeframe})
    appointmentID = str(cursor['_id'])
    doctor = betterdoctor.getDoctor("975eb48667ccb9eb20008d302685981d", doctorUID)
    _, phone = getSinglePracticeAndPhone(doctor["data"]["practices"])
    twilio_client.api.account.calls.create(to="6467120687", from_="8189460273", url="http://165.227.114.155:5000/getVoiceMessage/" + appointmentID)
    #TODO: make this actually call
    appt = {'doctorId': doctorUID, 'doctorName': doctorName, 'userId':session['userId'], 'time':timeframe*1000}
    user = db.user.find_one({'username': 'admin'})
    new_appts = user['new_appts']
    new_appts.append(appt)
    user['new_appts'] = new_appts
    db.user.update({'username': 'admin'}, user)
    user = db.user.find_one({'username': 'admin'})
    return json.dumps(user, default=json_util.default)

@app.route('/api/add_appointment', methods=['POST'])
def add_appointment():
    bodyData = None
    try:
        bodyData = json.loads(request.data)
    except json.JSONDecodeError:
        return "invalid JSON", 400
    time = bodyData['timeframe']
    userId = bodyData['userId']
    doctorName = bodyData['doctorName']
    doctorId = bodyData['doctorId']
    user = db.user.find_one({'username': 'admin'})
    new_appts = user['new_appts']
    new_appts.append(appt)
    user['new_appts'] = new_appts
    db.user.update({'username': 'admin'}, user)
    user = db.user.find_one({'username': 'admin'})
    user["_id"] = str(user['_id'])
    print(user)
    print("going to return user")
    return json.dumps(user, default=json_util.default)

@app.route("/getVoiceMessage/<uid>", methods = ['GET', 'POST'])
def getVoiceMessage(uid):
    # fill in with info from appointmentID
    cursor = db.appointment.find_one({'_id': ObjectId(uid)})
    doctorUID = cursor["doctorUid"]
    sTime = cursor["timeframe"]
    # number from 0 to 24, increments of .5
    startTime = datetime.fromtimestamp(int(sTime),)
    convertedTime = startTime.hour - 4+ startTime.minute/60
    date = startTime.strftime("%B %d")
    patientID = cursor["userId"]
    cursor2 = db.user.find_one({"_id": ObjectId(patientID)})
    patientFName = cursor2['firstName'] # first and last names may (should?) be combined into one string
    patientLName = cursor2["lastName"]
    doctor = betterdoctor.getDoctor("975eb48667ccb9eb20008d302685981d", doctorUID)
    doctorName = doctor["data"]["profile"]["last_name"]

    message = (patientFName + " " + patientLName + " has an appointment with doctor" + doctorName +
               " from " + stringTime(convertedTime) + " to " + stringTime(convertedTime + .5) + "on " + date)

    response = VoiceResponse()
    response.say(message)
    response.hangup()
    xml = response.to_xml()
    return xml

def stringTime(time): #  7 produces "seven o clock A M", 17.5 produces "five 30 P M"
    hour = str(math.floor(time) % 12)
    if time % 1 == 0:
        suffix = " o clock "
    else:
        suffix = " 30 "
    if time < 12:
        merid = "A M"
    else:
        merid = "P M"

    return hour + suffix + merid


@app.route('/api/user', methods = ['GET'])
def user():
    uid = session['userId']
    username = session['username']
    insuranceID = session['insuranceID']
    firstName = session['firstName']
    lastName = session['lastName']
    birthday = session['birthday']
    appointments = session['appointments']
    return jsonify(uid=uid, username=username, firstName = firstName,
                   lastName = lastName, birthday=birthday,
                   appointments = appointments)

@app.route('/api/user_appointments', methods=['GET'])
def user_appointments():
    appt_1 = {'doctorId':0, 'doctorName':"John Last", 'userId':0, 'time':1507780800000}
    appt_2 = {'doctorId':0, 'doctorName':"Elise Peterson", 'userId':0, 'time':1503979200000}
    appt_3 = {'doctorId':0, 'doctorName':"Masa Hontoni", 'userId':0, 'time':1510462800000}
    appt_4 = {'doctorId':0, 'doctorName':"Karthus Minion", 'userId':0, 'time':1509336000000}
    old_appts = [appt_1, appt_2]
    new_appts = [appt_3, appt_4]
    db.user.insert({'username':'admin', 'password':'admin',
                    'firstName': 'Admin', 'lastName':'Kim',
                    'old_appts':old_appts, 'new_appts':new_appts})
    cursor = db.user.find_one({'username':'admin'})
    cursor["_id"] = str(cursor["_id"])
    return json.dumps(cursor, default=json_util.default)


@app.route('/api/login', methods = ['POST'])
def login():
    bodyData = None
    try:
        bodyData = json.loads(request.data)
    except json.JSONDecodeError:
        return "invalid JSON", 400
    username = bodyData['username']
    pw = bodyData['password']
    cursor = db.user.find_one({'username': username})
    if cursor == None:
        #print("User is not existed")
        return "Unauthorized", 401
    else:
        if cursor['password'] == pw:
            session['userId'] = str(cursor['_id'])
            session['username'] = cursor['username']
            session['firstName'] = cursor['firstName']
            session['lastName'] = cursor['lastName']
            # session['birthday'] = cursor['birthday']
            print("added everything into database")
    return ""
    #return jsonify(username=username, pw=pw)

@app.route('/api/signup', methods = ['POST'])
def signup():
    username = request.form['username']
    pw = request.form['password']
    firstName = request.form['firstName']
    lastName = request.form['lastName']
    insurance = request.form['insuranceId']
    birthday = request.form['birthday']
    db.user.insert({'username':username, 'password':pw,
                    'firstName': firstName, 'lastName': lastName, 'insuranceId':insurance,
                    'birthday': birthday})
    response = Response()
    response.status_code = 200
    return response.json()


@app.route('/api/getSpecialties', methods = ['GET'])
def getSpecialties():
    speclist = betterdoctor.getSpecialties("975eb48667ccb9eb20008d302685981d")["data"]
    specdict = {}
    for d in speclist:
        specdict[d['name']] = d['uid']
    return json.dumps(specdict)



if __name__ == '__main__':
    app.secret_key = "" #left out
    print(STATIC_PATH)
    app.run(host="0.0.0.0")
