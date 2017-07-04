# BDLawsViz

## Create virtualenv bucketlistenv

	$ virtualenv lawenv
	$ source ./lawenv/bin/activate


## Setting up environment

    Create Virtual Environment

        $ virtualenv lawenv

    Install packages

        $ pip install flask
	    $ pip install flask-mysql


## Running in Linux console:

	$ source scripts/build.sh


## Notes:

    - If javascript files seem persistent and changes not showing in browser,
        then force re-load browser: ctrl + F5

    - Used MySQL stored procedures


## MySQL

    Login through terminal:

        $ mysql -u <username> -p

### Adding MySQL Stored Procedures

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