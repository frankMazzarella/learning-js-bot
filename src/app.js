require('dotenv').config();
const log4js = require('log4js');
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const healthcheck = require('express-healthcheck');
const compression = require('compression');
const { IncomingWebhook } = require('@slack/client');

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', healthcheck());

const port = process.env.PORT || 3000;
const logger = log4js.getLogger();
logger.level = 'info';

function handleAppStarted() {
  logger.info(`app started on port ${port}`);
  const timeNotification = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  const currentTime = new Date().toUTCString();
  const message = `Service *v${process.env.npm_package_version}* has started at *${currentTime}* ` +
    `on *${os.hostname}* - *(${os.platform})*`;

  timeNotification.send(message, (err) => {
    if (err) {
      logger.error(err);
      return;
    }
    logger.info('startup notification sent');
  });
}

app.listen(port, handleAppStarted);

