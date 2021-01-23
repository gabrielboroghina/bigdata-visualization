const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CovidInfoSchema = new Schema({
    dateRep: {
        type: Date,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    week: {
        type: String,
        required: true
    },
    cases_weekly: {
        type: String,
        required: true
    },
    deaths_weekly: {
        type: String,
        required: true
    },
    countriesAndTerritories: {
        type: String,
        required: true
    },
    geoId: {
        type: String,
        required: true
    },
    countryterritoryCode: {
        type: String,
        required: true
    },
    popData2019: {
        type: String,
        required: true
    },
    continentExp: {
        type: String,
        required: true
    },
    notificationRatePer100000Population14Days: {
        type: String,
        required: true
    },
}, { timestamps: false });

const CovidInfosModel = mongoose.model('CovidInfos', CovidInfoSchema);


module.exports = CovidInfosModel;
 