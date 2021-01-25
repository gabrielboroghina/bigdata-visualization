const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CovidInfoSchema = new Schema({
  country: {
    type: String,
    required: true
  },
  cases: {
    type: String,
    required: true
  },
  deaths: {
    type: String,
    required: true
  },
}, {timestamps: false});

const CovidInfosModelAgg = mongoose.model('CovidInfosAgg', CovidInfoSchema);


module.exports = CovidInfosModelAgg;
 