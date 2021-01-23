#!/bin/bash
set -e

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


INPUT=/tmp/data.csv
OLDIFS=$IFS
IFS=','
unixDateDelim="-"

[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }
i=1
while read dateRep yearWeek casesWeekly deathsWeekly countriesAndTerritories geoId countryterritoryCode popData2019 continentExp notificationRatePer100000Population14Days
do
  test $i -eq 1 && ((i=i+1)) && continue
  yearR=$(cut -d'/' -f3 <<< $dateRep)
	month=$(cut -d'/' -f2 <<< $dateRep)
	day=$(cut -d'/' -f1 <<< $dateRep)
	date=$yearR$unixDateDelim$month$unixDateDelim$day
	week=$(cut -d'-' -f2 <<< $yearWeek)
  year=$(cut -d'-' -f1 <<< $yearWeek)
  rate=$(tr -d '[:space:]' <<<$notificationRatePer100000Population14Days)
mongo <<EOF
use $MONGO_INITDB_DATABASE
db.covidinfos.insert({
  dateRep: Date('$date'),
  year: '$year',
  week: '$week',
  cases_weekly: '$casesWeekly',
  deaths_weekly: '$deathsWeekly',
  countriesAndTerritories: '$countriesAndTerritories',
  geoId: '$geoId',
  countryterritoryCode: '$countryterritoryCode',
  popData2019: '$popData2019',
  continentExp: '$continentExp',
  notificationRatePer100000Population14Days: '$rate'
})
EOF
done < $INPUT
IFS=$OLDIFS
