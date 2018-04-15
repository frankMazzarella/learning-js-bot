require('dotenv').config();
const log4js = require('log4js');
const express = require('express');
const bodyParser = require('body-parser');
const healthcheck = require('express-healthcheck');
const compression = require('compression');
const routes = require('./routes');

// TODO: database config is duplicated
// TODO: remove dependency on incoming webhook and just respond from bot user

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/slack', routes);
app.get('*', healthcheck());

const port = process.env.PORT || 3000;
const logger = log4js.getLogger();
logger.level = 'info';

function handleAppStarted() {
  logger.info(`app started on port ${port}`);
}

app.listen(port, handleAppStarted);
