const {
    CovidInfos
} = require('../data');

const getByCountryCode = async (countryCode) => {
    // get info by country code
    const covidInfos = await CovidInfos.find({countryterritoryCode: countryCode}).sort({year_week: 1})
    return covidInfos.map(info => {
        const fields = info.year_week.split("-");
        return {
            year: parseInt(fields[0]),
            week: parseInt(fields[1]),
            year_week: info.year_week,
            cases: parseInt(info.cases_weekly),
            deaths: parseInt(info.deaths_weekly)
        };
    });
};

const getAll = async () => {
    covidInfosMap = {};
    const covidInfos = await CovidInfos.find().sort({countryterritoryCode: 1});

    covidInfos.map(info => {
        if (covidInfosMap[info.countryterritoryCode] == null) {
            covidInfosMap[info.countryterritoryCode] = {
                deaths: parseInt(info.deaths_weekly),
                cases: parseInt(info.cases_weekly),
            };
        } else {
            covidInfosMap[info.countryterritoryCode].deaths += parseInt(info.deaths_weekly);
            covidInfosMap[info.countryterritoryCode].cases += parseInt(info.cases_weekly);
            covidInfosMap[info.countryterritoryCode].rate = parseFloat((covidInfosMap[info.countryterritoryCode].cases * 1000 / parseInt(info.popData2019)).toFixed(2));
        }
    });



    return covidInfosMap;
};

module.exports = {
    getByCountryCode,
    getAll
}