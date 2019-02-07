# Healix Server Side


## Getting Started


These instructions will get you a copy of the project up and running on your local machine for development.

### Prerequisites

You must have python and pip installed. 

You might want to run this project in a virtual environment.

I have chosen *venv* for the name of a virtual environment.

```
pip install virtualenv
cd server/                      # in case you are not in this directory
virtualenv venv
ls -la                          # to check if venv folder is created
source venv/bin/activate
```

### Installing

```
pip install requirements.txt 
```

In case ```pip install``` doesn't work, run the following command:
```
pip install --upgrade -r requirements.txt
```

Our server supports Twilio API, but is commented out. If you have an account, you can un-comment the API to utilize its voice feature.

### Running

```
EXPORT FLASK_APP=main.py
flask run
```

The port is at 5000 by default.

### Note

This project is not supported.
