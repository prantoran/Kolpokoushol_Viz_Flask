# all the imports
import os
import itertools
import spacy

from pymongo import MongoClient
from nltk.stem.porter import PorterStemmer
from flask.ext.mysql import MySQL
from flask.ext.cache import Cache
from flask import Flask, request, json, session, g, redirect, url_for, abort, \
     render_template, flash, session, jsonify


app = Flask(__name__) # create the application instance :)


# Cache
cache = Cache(app,config={'CACHE_TYPE': 'simple'})

SEC_IN_HOUR = 60*60
SEC_IN_DAY = 60*60*24
SEC_IN_MINUTE = 60
CUR_CACHE_DURATION = SEC_IN_MINUTE
LAW_COUNT = 704

# config
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'secret_xxx',
    port = 5050,
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
network = db.network
stemmer = PorterStemmer()


## Routes ##

@app.route("/", methods=['GET','POST'])
@cache.cached(timeout=CUR_CACHE_DURATION)
def main():
    print("en main")
    return render_template('index.html')


@app.route("/prac", methods=['GET','POST'])
@cache.cached(timeout=CUR_CACHE_DURATION)
def prac():
    return render_template('prac.html')


@app.route("/index", methods=['GET','POST'])
@cache.cached(timeout=CUR_CACHE_DURATION)
def main_redirect():
    return render_template('index.html')


@app.route('/showsignup')
@cache.cached(timeout=CUR_CACHE_DURATION)
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
@cache.cached(timeout=CUR_CACHE_DURATION)
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
    ret = getallnames_mysql()
    return ret

@cache.cached(timeout=CUR_CACHE_DURATION, key_prefix='all_names')
def getallnames_mysql():
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
    ret = getalledges_mysql()
    return ret


@cache.cached(timeout=CUR_CACHE_DURATION, key_prefix='all_edges')
def getalledges_mysql():
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

@app.route('/law_network', methods=['GET'])
def get_inner_viz():
    law_id = int(request.args.get('id', 1))
    print("law_id:"+str(law_id))
    data = get_inner_law_detail(law_id)

    return jsonify({
        'id' : law_id,
        'nodes' : data['nodes'],
        'links' : data['edges']
    })


# Returns inner law detail
@cache.memoize(timeout=CUR_CACHE_DURATION)
def get_inner_law_detail(law_id):
    data = network.find_one({'law_id' : law_id})
    return data



@app.route('/search', methods=['GET'])
def search():
    query = str(request.args.get('query', ''))
    # Enforcing ngram search by default
    only_ngram_search = bool(int(request.args.get('ngram', True)))

    # Excluding the unigram by default

    exclude_unigram = bool(int(request.args.get('exclude_unigram', True)))

    ids = _search(query, only_ngram_search=only_ngram_search, exclude_unigram=exclude_unigram)
    # DEBUG_MSG
    # print("QUERY: {}\nONLY NGRAM SEARCH: {}".format(query, only_ngram_search))
    return jsonify({
        "ids" : ids,
        "id_count" : len(ids)
    })

# Request pattern: http://localhost:5000/edge_detail?source=344&destination=7
@app.route('/edge_detail', methods=['GET'])
def edge_detail():
    source_id = int(request.args.get('source', 344))
    destination_id = int(request.args.get('destination', 86))

    _edge_details = get_edge_detail(source_id, destination_id)

    return json.dumps(_edge_details)





# Returns edge detail on given source law id and destination law id
@cache.memoize(timeout=CUR_CACHE_DURATION)
def get_edge_detail(source_id, destination_id):
    # Edge data
    edge_data = []

    # Getting law dictionary
    source = laws.find_one({'law_id': source_id})
    destination = laws.find_one({'law_id': destination_id})

    # This title will be searched through the law doc
    try:
        destination_title = destination['title'].lower()
    except:
        return []


## search_script.py
@cache.memoize(timeout=CUR_CACHE_DURATION)
def _search(text, only_ngram_search=True, exclude_unigram=True):
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

    # If strict ngram is turned on, exclude unigrams
    if exclude_unigram == True:

        sw = filtered_text.lower().split(' ')

        search_combinations = ["_".join([word for word in combination]) for combination in
                               itertools.permutations(sw, len(sw))]

        for search_words in search_combinations:
            for _id in range(1, LAW_COUNT):
                bigram_text = bigrams.find_one({'law_id' : _id })['text']
                trigram_text = trigrams.find_one({'law_id' : _id})['text']

                for btoken, ttoken in zip(bigram_text.split(' '), trigram_text.split(' ')):
                    if '_' in btoken or '_' in ttoken:
                        if search_words == btoken or search_words == ttoken:
                            _ids.append(_id)
        return list(set(_ids))


    else:

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

    return list(set(_ids))


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
