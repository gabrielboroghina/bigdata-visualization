const {
    CovidInfos,
    CovidInfosAge,
    CovidInfosAgg
} = require('../data');
const axios = require("axios");

const sparkRoute = "http://localhost:7777";

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
    const covidInfosMap = {};
    let covidInfos = await CovidInfos.find().sort({countryterritoryCode: 1});
    covidInfos = covidInfos.filter(info => info.countryterritoryCode.length);

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


const getAgeCategoriesByCountry = async (countryCode) => {
    const countryEntry = await CovidInfos.findOne({countryterritoryCode: countryCode})
    console.log(countryEntry);
    const countryName = countryEntry.countriesAndTerritories;

    const covidInfosMap = {
        "<15yr": {},
        "15-24yr": {},
        "25-49yr": {},
        "50-64yr": {},
        "65-79yr": {},
        "80+yr": {}
    };
    // get info by country code
    const covidInfos = await CovidInfosAge.find({country: countryName}).sort({age_category: 1, year_week: 1});
    covidInfos.map(info => {
        covidInfosMap[info.age_group][info.year_week] = parseInt(info.new_cases);
    });
    return covidInfosMap;
};

const fetchAggregatedData = async () => {
    const response = await axios.get(
        `${sparkRoute}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
    );
    const data = response.data;

    CovidInfosAgg.deleteMany({}, (err) => console.log(err)).then(()=> {
        CovidInfosAgg.insertMany(data, (err, result ) => {console.log(err, result)});
    });
    console.log("Data fetched from Spark");
    return data;
}

module.exports = {
    getByCountryCode,
    getAll,
    getAgeCategoriesByCountry,
    fetchAggregatedData,
}