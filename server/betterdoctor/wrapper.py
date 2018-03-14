import requests
import json

BASE_URL = "https://api.betterdoctor.com/2016-03-01"

# All public functions follow the parameter requirements outlined here
# https://developer.betterdoctor.com/documentation15#/


def _makeDict(**kwargs):
    requestDict = {}
    for key in kwargs:
        if kwargs[key] is not None:
            requestDict[key] = kwargs[key]

    return requestDict


def _returnOrExcept(res):
    if res.status_code == 200:
        return json.loads(res.text)
    else:
        print(res.text)
        raise ValueError(str(res.status_code))


def getDoctors(key, name=None, firstName=None, lastName=None, query=None,
               specialty=None, insurance=None, practice=None, location=None,
               userLocation=None, gender=None, sort=None, fields=None, skip=0,
               limit=10):
    requestDict = _makeDict(user_key=key, name=name, first_name=firstName,
                            last_name=lastName, query=query,
                            specialty_uid=specialty, insurance_uid=insurance,
                            practice_uid=practice, location=location,
                            user_location=userLocation, gender=gender,
                            sort=sort, fields=fields, skip=skip, limit=limit)
    response = requests.get(BASE_URL + "/doctors", params=requestDict)
    return _returnOrExcept(response)


def getDoctor(key, uid, fields=None):
    requestDict = _makeDict(user_key=key, uid=uid, fields=fields)
    response = requests.get(BASE_URL + "/doctors/" + uid,
                            params=requestDict)
    return _returnOrExcept(response)


def getConditions(key, limit=None, skip=None, fields=None):
    requestDict = _makeDict(user_key=key, limit=limit, skip=skip,
                            fields=fields)
    response = requests.get(BASE_URL + "/conditions", params=requestDict)
    return _returnOrExcept(response)


def getInsurances(key, limit=None, skip=None, fields=None):
    requestDict = _makeDict(user_key=key, limit=limit, skip=skip,
                            fields=fields)
    response = requests.get(BASE_URL + "/insurances", params=requestDict)
    return _returnOrExcept(response)


def getSpecialties(key, limit=None, skip=None, fields=None):
    requestDict = _makeDict(user_key=key, limit=limit, skip=skip,
                            fields=fields)
    response = requests.get(BASE_URL + "/specialties", params=requestDict)
    return _returnOrExcept(response)


def getDoctorsInPracticeByNPI(key, npi, limit=None, skip=None, fields=None):
    requestDict = _makeDict(user_key=key, npi=npi, limit=limit, skip=skip,
                            fields=fields)
    response = requests.get(BASE_URL + "/practices/npi/" + npi + "/doctors",
                            params=requestDict)
    return _returnOrExcept(response)


def getDoctorsInPracticeByUID(key, uid, limit=None, skip=None, fields=None):
    requestDict = _makeDict(user_key=key, uid=uid, limit=limit, skip=skip,
                            fields=fields)
    response = requests.get(BASE_URL + "/practices/" + uid + "/doctors",
                            params=requestDict)
    return _returnOrExcept(response)


def getPracticeDescriptionByNPI(key, npi, fields=None):
    requestDict = _makeDict(user_key=key, npi=npi, fields=fields)
    response = requests.get(BASE_URL + "/practices/npi/" + npi,
                            params=requestDict)
    return _returnOrExcept(response)


def getPracticeDescriptionByUID(key, uid, fields=None):
    requestDict = _makeDict(user_key=key, uid=uid, fields=fields)
    response = requests.get(BASE_URL + "/practices/" + uid,
                            params=requestDict)
    return _returnOrExcept(response)


def getPractices(key, limit=None, skip=None, sort=None, location=None, name=None):
    requestDict = _makeDict(user_key=key, limit=limit, skip=skip, sort=sort,
                            location=location, name=name)
    response = requests.get(BASE_URL + "/practices/", params=requestDict)
    return _returnOrExcept(response)


def getDoctorDescriptionByNPI(key, npi, fields=None):
    requestDict = _makeDict(user_key=key, npi=npi, fields=fields)
    response = requests.get(BASE_URL + "/doctors/npi/" + npi,
                            params=requestDict)
    return _returnOrExcept(response)


def getDoctorDescriptionByUID(key, uid, fields=None):
    requestDict = _makeDict(user_key=key, uid=uid, fields=fields)
    response = requests.get(BASE_URL + "/doctors/" + uid,
                            params=requestDict)
    return _returnOrExcept(response)
