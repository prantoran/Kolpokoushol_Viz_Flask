# BDLawsViz

## Create virtualenv bucketlistenv

	$ virtualenv lawenv
	$ source ./lawenv/bin/activate


## Setting up environment

### Create Virtual Environment

    $ virtualenv lawenv

### Install packages

    $ pip install flask
    $ pip install flask-mysql
    $ pip install pymongo
    $ pip install nltk

#### Installing spaCy

    $ pip install spacy
    $ python -m spacy download en
( first download the en_core_web_sm-1.2.0.tar.gz package from https://github.com/explosion/spacy-models )
    $ pip install en_core_web_sm-1.2.0.tar.gz 
	 
	

### Installing everything automatically

    $ pip install -r requirements.txt

## Running in Linux console:

	$ source scripts/build.sh


## Notes:

    - If javascript files seem persistent and changes not showing in browser,
        then force re-load browser: ctrl + F5

    - Used MySQL stored procedures

    - Used spaCy
	
-used MongoDB for performing searches


## MongoDB

- Instantiating Mongo Server
	
mongod --dbpath /path/to/mongodb --port mongo_port

or 

source scripts/build.sh


- Import bson using mongorestore:
	
mongorestore --port mongo_port db_name -c collection_name path/file.bson

eg.

mongorestore --port 4000 -d law -c bigrams `pwd`/bigrams.bson
mongorestore --port 4000 -d law -c trigrams `pwd`/trigrams.bson
mongorestore --port 4000 -d law -c laws `pwd`/laws.bson


## MySQL

    Login through terminal:

        $ mysql -u <username> -p

### Adding MySQL Stored Procedures

    Get All Names:
        DELIMITER $$
        USE `KolpoKoushol`$$
        DROP PROCEDURE IF EXISTS `sp_getAllNames` $$
        CREATE PROCEDURE `sp_getAllNames` ()
        BEGIN
            select * from lawIDs;
        END$$
        DELIMITER ;

    Get All Edges:
        DELIMITER $$
        USE `KolpoKoushol`$$
        DROP PROCEDURE IF EXISTS `sp_getAllEdges` $$
        CREATE PROCEDURE `sp_getAllEdges` ()
        BEGIN
            select * from bdlaws_edges;
        END$$
        DELIMITER ;

    Searching law name using id:
        DELIMITER $$
        USE `KolpoKoushol`$$
        DROP PROCEDURE IF EXISTS `sp_searchName` $$
        CREATE PROCEDURE `sp_searchName` (
        IN law_id bigint
        )
        BEGIN
            select L1.name as qname from lawIDs as L1 where L1.id = law_id;
        END$$
        DELIMITER ;

    Searching outdegree ids using searched id:
        DELIMITER $$
        USE `KolpoKoushol`$$
        DROP PROCEDURE IF EXISTS `sp_searchOutDegree` $$
        CREATE PROCEDURE `sp_searchOutDegree` (
        IN law_id bigint
        )
        BEGIN
            select E.source as idS, L1.name as nameS, E.destination as idD, L2.name as nameD from bdlaws_edges as E LEFT OUTER JOIN lawIDs as L1 ON E.source = L1.id LEFT OUTER JOIN lawIDs as L2 ON E.destination = L2.id where E.source = law_id;
        END$$
        DELIMITER ;

    Searching indegree ids using searched id:
        DELIMITER $$
        USE `KolpoKoushol`$$
        DROP PROCEDURE IF EXISTS `sp_searchInDegree` $$
        CREATE PROCEDURE `sp_searchInDegree` (
        IN law_id bigint
        )
        BEGIN
            select E.source as idS, L1.name as nameS, E.destination as idD, L2.name as nameD from bdlaws_edges as E LEFT OUTER JOIN lawIDs as L1 ON E.source = L1.id LEFT OUTER JOIN lawIDs as L2 ON E.destination = L2.id where E.destination = law_id;
        END$$
        DELIMITER ;


## Trivial

###




