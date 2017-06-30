# all the imports
import os

from flask import Flask, request, json, session, g, redirect, url_for, abort, \
     render_template, flash, session

from flask.ext.mysql import MySQL


app = Flask(__name__) # create the application instance :)

app.secret_key = 'why would I tell you my secret key?'

mysql = MySQL()

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '123'
app.config['MYSQL_DATABASE_DB'] = 'KolpoKoushol'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


@app.route("/")
def main():
    return render_template('index.html')


@app.route("/searchname", methods=['POST'])
def search_name():
    try:
        _searchtext = request.form['searchText']

        if _searchtext:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('sp_searchName', (_searchtext,))
            data = cursor.fetchall()

            results_dict = []
            ret = "There is no law name for this id."
            for u in data:
                ret = u
                #u_dict = {
                #}
                #results_dict.append(u_dict)

            # return json.dumps(results_dict)
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
