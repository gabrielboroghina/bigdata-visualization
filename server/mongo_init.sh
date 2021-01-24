#!/bin/sh
#set -e
INPUT1=/tmp/data.csv
INPUT2=/tmp/data2.csv

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

mongoimport --type csv -d $MONGO_INITDB_DATABASE -c covidinfos --headerline --drop $INPUT1
mongoimport --type csv -d $MONGO_INITDB_DATABASE -c covidinfosages --headerline --drop $INPUT2

