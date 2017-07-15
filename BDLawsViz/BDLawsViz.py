# all the imports
import os
import itertools
import spacy

from flask import jsonify
from pymongo import MongoClient
from nltk.stem.porter import PorterStemmer
from flask.ext.mysql import MySQL
from flask import Flask, request, json, session, g, redirect, url_for, abort, \
     render_template, flash, session

from flask.ext.login import LoginManager, UserMixin, \
                                login_required, login_user, logout_user

import random
import sys

app = Flask(__name__) # create the application instance :)

# config
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'secret_xxx'
)

app.secret_key = 'PizzaHut e onekdin pizza khai nai :3'

mysql = MySQL()

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '123'
app.config['MYSQL_DATABASE_DB'] = 'KolpoKoushol'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

# Search Configuration
nlp = spacy.load('en')
client = MongoClient('localhost', 4000)
db = client.law
bigrams = db.bigrams
trigrams = db.trigrams
stemmer = PorterStemmer()



# flask-login
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)


## Routes ##

@app.route("/", methods=['GET','POST'])
def main():
    print("en main")
    return render_template('index.html')


@app.route("/index", methods=['GET','POST'])
def main_redirect():
    return render_template('index.html')


@app.route('/showsignup')
def signup():
    return render_template('signup.html')


@app.route('/signup',methods=['POST'])
def signUp():
    try:
        _name = request.form['inputName']
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']

        # validate the received values
        if _name and _email and _password:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('sp_createUser', (_name, _email, _password))
            data = cursor.fetchall()
            if len(data) is 0:
                con.commit()
                return json.dumps({'message': 'User created successfully !'})
            else:
                return json.dumps({'error': str(data[0])})
            return json.dumps({'html': '<span>All fields good !!</span>'})
        else:
            return json.dumps({'html': '<span>Enter the required fields</span>'})
    except Exception as e:
        return json.dumps("Error occured" + str(e))
    finally:
        cursor.close()
        con.close()


@app.route('/showsignin')
def showsignin():
    return render_template('signin.html')


@app.route('/validatelogin', methods=['POST'])
def validatelogin():
    try:
        _username = request.form['inputEmail']
        _password = request.form['inputPassword']
        print("username:"+str(_username))

        # connect to mysql

        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('sp_validateLogin', (_username,))
        data = cursor.fetchall()
        print(data[0][0])
        print(data[0][1])
        print(data[0][2])


        if len(data) > 0:
            if data[0][3] == _password:
                user = {
                    'name': data[0][1],
                    'email': data[0][2]
                }
                session['user'] = data[0][1]
                return json.dumps(user)
            else:
                return json.dumps('Wrong Email address or Password.')
        else:
            return json.dumps('Wrong Email address or Password.')

    except Exception as e:
        return json.dumps(str(e))
    finally:
        cursor.close()
        con.close()


@app.route('/home', methods=['GET','POST'])
def home():
    if session.get('user'):
        return render_template('home.html')
    else:
        return render_template('error.html', error='Unauthorized Access')



@app.route('/logout', methods=['GET','POST'])
def logout():
    if request.method == 'GET':
        return json.dumps("logout done")
    print("cookie:" + request.headers.get('Cookie'))
    session.pop('user', None)
    return json.dumps("logout done")

@app.route('/error')
def error():
    return render_template("error.html", code=302)




# Routes

@app.route('/getallnames', methods=['GET'])
def getallnames():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('sp_getAllNames')
        data = cursor.fetchall()

        ret = []
        for u in data:
            u_dict = {
                'Id': u[0],
                'name': u[1]
            }
            ret.append(u_dict)

        return json.dumps(ret)

    except Exception as e:
        return json.dumps("Error occured" + str(e))

    finally:
        cursor.close()
        con.close()


@app.route('/getalledges', methods=['GET'])
def getalledges():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('sp_getAllEdges')
        data = cursor.fetchall()

        ret = []
        for u in data:
            if u[0] == u[1]:
                continue
            u_dict = {
                'source': u[0],
                'destination': u[1]
            }
            ret.append(u_dict)

        return json.dumps(ret)

    except Exception as e:
        return json.dumps("Error occured" + str(e))

    finally:
        cursor.close()
        con.close()


@app.route("/searchname", methods=['POST'])
def search_name():
    try:
        _searchtext = request.form['searchText']

        if _searchtext:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('sp_searchName', (_searchtext,))
            data = cursor.fetchall()

            ret = "There is no law name for this id."
            for u in data:
                ret = u

            return ret
        else:
            return "Error: _searchText empty"

    except Exception as e:
        return "Error occurred:"+str(e)

    finally:
        cursor.close()
        con.close()


@app.route("/searchoutdegree", methods=['POST'])
def search_outdegree():
    try:
        _searchtext = request.form['searchText']

        if _searchtext:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('sp_searchOutDegree', (_searchtext,))
            data = cursor.fetchall()

            ret = []
            for u in data:

                if u[2] == u[0]:
                    continue

                if u[0] and u[1] and u[2] and u[3]:
                    u_dict = {
                        'idS': u[0],
                        'nameS': u[1],
                        'idD': u[2],
                        'nameD': u[3],
                    }
                    ret.append(u_dict)

            return json.dumps(ret)

        else:
            return json.dumps("Error: _searchText empty")

    except Exception as e:
        return json.dumps("Error occurred:"+str(e))

    finally:
        cursor.close()
        con.close()


@app.route("/searchindegree", methods=['POST'])
def search_indegree():
    try:
        _searchtext = request.form['searchText']

        if _searchtext:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('sp_searchInDegree', (_searchtext,))
            data = cursor.fetchall()

            ret = []
            for u in data:

                if u[2] == u[0]:
                    continue

                if u[0] and u[1] and u[2] and u[3]:
                    u_dict = {
                        'idS': u[0],
                        'nameS': u[1],
                        'idD': u[2],
                        'nameD': u[3],
                    }
                    ret.append(u_dict)

            return json.dumps(ret)

        else:
            return json.dumps("Error: _searchText empty")

    except Exception as e:
        return json.dumps("Error occurred:"+str(e))

    finally:
        cursor.close()
        con.close()



## Search Routes

@app.route('/search', methods=['GET'])
def search():
    query = str(request.args.get('query', ''))
    only_ngram_search = bool(int(request.args.get('ngram', True)))
    ids = _search(query, only_ngram_search=only_ngram_search)
    # DEBUG_MSG
    # print("QUERY: {}\nONLY NGRAM SEARCH: {}".format(query, only_ngram_search))
    print(ids)
    print(type(ids))
    return jsonify({
        "ids" : ids,
        "id_count" : len(ids)
    })





## search_script.py

def _search(text, only_ngram_search=True):
    # Ids
    _ids = []

    # Final search text
    ngram_search = ""

    # stemmed text
    text = nlp(u'' + text)

    # Only alphabet is real
    filtered_text = " ".join([stemmer.stem(t.lower_) for t in text if t.is_alpha])


    print(filtered_text)

    # Make a spacy doc
    text_doc = nlp(u'' + filtered_text)

    # Take word count
    word_count = text_doc.__len__()

    # DEBUG_MSG
    # print("WORD COUNT : {}".format(word_count))


    # Make ngram then search
    if (word_count > 1 and word_count < 4):
        # Splitting the keywords into separate words
        search_words = filtered_text.lower().split(' ')

        # DEBUG_MSG
        # print("SEARCH WORDS ", search_words)

        # Creating combination of n-grams
        search_combinations = ["_".join([word for word in combination]) for combination in itertools.permutations(search_words, len(search_words))]

        for combination in search_combinations:
            _ids.append(search_database(combination, ngram_search=True))


        _ids = list(set(sum(_ids, [])))

        # print("NGRAM _ ")


    if only_ngram_search == False or word_count > 3:
        all_key_search = search_database(filtered_text, ngram_search=False, delimiter=" ")

        # Concatening the list
        _ids = _ids + all_key_search

        # DEBUG_MSG
        # print("ALL KEY SEARCH: {}".format(all_key_search))

    return _ids

def search_database(text, ngram_search=True, delimiter='_'):
    _ids = []

    if ngram_search == True:
        for _id in range(1, 705):
            law_bigram = bigrams.find_one({'law_id' : _id})['text']
            law_trigram = trigrams.find_one({'law_id' : _id})['text']
            if text in law_bigram or text in law_trigram:
                _ids.append(_id)
    else:
        keywords = [stemmer.stem(key) for key in text.split(delimiter)]
        for _id in range(1, 705):
            law_bigram = bigrams.find_one({'law_id' : _id})['text']
            found_all = []
            for key in keywords:
                if key in law_bigram.split():
                    found_all.append(1)
            if sum(found_all) == len(keywords):
                _ids.append(_id)

    return _ids
