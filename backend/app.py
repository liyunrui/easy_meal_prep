from flask import Flask, jsonify, request, json
from flask_pymongo  import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from elasticsearch import Elasticsearch

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'mealprep'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/mealprep'
app.config['JWT_SECRET_KEY'] = 'secret'

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
# Setup the Flask-JWT-Extended extension
jwt = JWTManager(app)

# elastic search
def connect_elasticsearch():
    """
    Before running this function, make sure you launch elasticsearch in terminal 
    """
    _es = None
    _es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
    if _es.ping():
        print('Succesfully Connected')
    else:
        print('Failed to connection')
    return _es

CORS(app)
@app.route('/users/register', methods=['POST'])
def register():
    """
    Wheun user request, the function will be called, and what this function returns is called response.

    """
    users = mongo.db.users # create a collection called users 
    print ('register',request.get_json())
    name = request.get_json()['name'] # request.get_json(): return a dictionary
    email = request.get_json()['email']
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    created = datetime.utcnow()

    # create a data in users collections 
    user_id = users.insert({
    'name': name,
	'email' : email, 
	'password' : password, 
	'created' : created,  # ctime
	})
    # query data from MongoDB users collection
    new_user = users.find_one({'_id' : user_id}) # return a dictionary
    print ('new_user',new_user)
    # noted:_id is 12 bytes hexadecimal number unique for every document in a collection
    result = {'email' : new_user['email'] + ' registered'}
    return jsonify({'result' : result})

@app.route('/users/login', methods=['POST'])
def login():
    print ('login',request.get_json())
    users = mongo.db.users # connect to users collections
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""
	
    response = users.find_one({'email' : email})
    print ("response", response)
    if response:
        if bcrypt.check_password_hash(response['password'], password):
            # encrypted token
            access_token = create_access_token(identity = {
			    'name': response['name'],
				'email': response['email']
                }
				)
            print ('access_token', access_token)
            result = access_token
        else:
            # wrong password
            result = jsonify({"error":"Invalid username and password"})            
    else:
        # cannot find existing email in db
        result = jsonify({"result":"No results found"})
    print ("result", result)
    return result

@app.route('/search', methods=['POST'])
def get_top_k_relevant(top_k = 5):
    """
    do not support chinese currently.
    """
    query = request.json["query"]

    search_object = {"query": {
    "match": {
      "food_name": query
    }
    }}
    print ('search_object',search_object)
    index_name = 'macros'
    es = connect_elasticsearch()
    output = es.search(index=index_name, body=search_object)
    # get the most top k relevant result
    output = [s_res["_source"] for s_res in output['hits']["hits"]][:top_k]
    print ('search result', output)
    result = jsonify({"result":output})
    return result

if __name__ == '__main__':
    app.run(debug=True)