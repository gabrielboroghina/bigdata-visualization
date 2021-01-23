const {
    CovidInfos
} = require('../data');

const getByCountryCode = async (countryCode) => {
    // get info by country code
    const covidInfos = await CovidInfos.find({countriesAndTerritories: countryCode});
    return covidInfos.map(info => {
        return {
            year: info.year,
            week: info.week,
            cases: info.cases_weekly,
            deaths: info.deaths_weekly
        };
    });
};

module.exports = {
    getByCountryCode
}