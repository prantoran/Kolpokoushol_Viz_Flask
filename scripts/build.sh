clear

source ./lawenv2/bin/activate

pip install --editable .

export FLASK_APP=BDLawsViz
export FLASK_DEBUG=true
python -m flask run

deactivate lawenv2
