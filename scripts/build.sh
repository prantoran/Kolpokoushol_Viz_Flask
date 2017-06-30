clear

source ./lawenv/bin/activate

pip install --editable .

export FLASK_APP=BDLawsViz
export FLASK_DEBUG=true
flask run

deactivate lawenv
