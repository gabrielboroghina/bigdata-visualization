const express = require('express');

const CovidInfoService = require('./services.js');
const {
    validateFields
} = require('../utils');

const {
    ServerError
} = require('../errors');

const router = express.Router();

router.get('/countries/ages/:countryCode', async (req, res, next) => {
    const countryCode = req.params.countryCode;
    try {

        validateFields({
            countryCode: {
                value: countryCode,
                type: 'ascii'
            }
        });
        const covidInfos = await CovidInfoService.getAgeCategoriesByCountry(countryCode);
        res.json(covidInfos);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js
        next(err);
    }
});

router.get('/countries/:countryCode', async (req, res, next) => {
    const countryCode = req.params.countryCode;

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

router.get('/countries', async (req, res, next) => {
    try {
        const covidInfos = await CovidInfoService.getAll();
        res.json(covidInfos);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js
        next(err);
    }
});

router.post('/countries/ages', async (req, res, next) => {

    try{
        await CovidInfoService.add();
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        console.log(err.message);
        next(err);
    }
});


module.exports = router;