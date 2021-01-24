const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CovidInfoAgeSchema = new Schema({
    country: {
        type: String,
        required: true
    },
    country_code: {
        type: String,
        required: true
    },
    year_week: {
        type: String,
        required: true
    },
    age_group: {
        type: String,
        required: true
    },
    new_cases: {
        type: String,
        required: true
    },
    population: {
        type: String,
        required: true
    },
    rate_14_day_per_100k: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    }
}, { timestamps: false });

const CovidInfosAgeModel = mongoose.model('CovidInfosAges', CovidInfoAgeSchema);


module.exports = CovidInfosAgeModel;
 