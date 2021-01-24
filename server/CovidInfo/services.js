const {
    CovidInfos
} = require('../data');

const getByCountryCode = async (countryCode) => {
    // get info by country code
    const covidInfos = await CovidInfos.find({countryterritoryCode: countryCode}).sort({year_week: 1})
    return covidInfos.map(info => {
        const fields = info.year_week.split("-");
        return {
            year: fields[0],
            week: fields[1],
            cases: info.cases_weekly,
            deaths: info.deaths_weekly
        };
    });
};

module.exports = {
    getByCountryCode
}