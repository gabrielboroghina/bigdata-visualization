const Router = require('express')();

const CovidInfoController = require('../CovidInfo/controllers.js');

Router.use('/covid/info', CovidInfoController);

module.exports = Router;