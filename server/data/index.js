const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.MUSER}:${process.env.MPASSWORD}@${process.env.MHOST}:${process.env.MPORT}/${process.env.MDATABASE}?authSource=admin`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
  } catch (e) {
    console.trace(e);
  }
})();

const CovidInfos = require('./models/CovidInfo.js');
const CovidInfosAge = require('./models/CovidInfoPerAge.js');

module.exports = {
  CovidInfos,
  CovidInfosAge
}