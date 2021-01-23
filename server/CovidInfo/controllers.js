const express = require('express');

const CovidInfoService = require('./services.js');
const {
    validateFields
} = require('../utils');

const {
    ServerError
} = require('../errors');

const router = express.Router();


router.get('/', async (req, res, next) => {
    const countryCode = req.query.countryCode;

    try {

        validateFields({
            countryCode: {
                value: countryCode,
                type: 'ascii'
            }
        });
        const covidInfos = await CovidInfoService.getByCountryCode(countryCode);
        res.json(covidInfos);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});


module.exports = router;