class User(object):
    def __init__(self, username, firstName, lastName, insuranceId, birthday):
        self.username = username
        self.firstName = firstName
        self.lastName = lastName
        self.insuranceId = insuranceId
        self.birthday = birthday
        self.appt = []


class Appointments(object):
    def __init__(self, doctorId, userId, timeframe)
        self.doctorId = doctorId
        self.userId = userId
        self.timeframe = timeframe


