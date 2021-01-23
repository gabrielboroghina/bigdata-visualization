#!/bin/bash
set -e
INPUT=/tmp/data.csv

mongo <<EOF
use '$MONGO_INITDB_DATABASE'
db.createUser({
  user:  '$MONGO_INITDB_ROOT_USERNAME',
  pwd: '$MONGO_INITDB_ROOT_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: '$MONGO_INITDB_DATABASE'
  }]
})
EOF

mongoimport --type csv -d $MONGO_INITDB_DATABASE -c covidinfos --headerline --drop $INPUT

