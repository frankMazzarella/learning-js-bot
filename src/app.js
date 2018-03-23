require('dotenv').config();
const log4js = require('log4js');
const { IncomingWebhook } = require('@slack/client');

const logger = log4js.getLogger();
logger.level = 'info';
logger.info('app stared');

const timeNotification = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
const currentTime = new Date().toTimeString();
timeNotification.send(`The current time is ${currentTime}`, (err) => {
  if (err) {
    logger.error(err);
    return;
  }
  logger.info('notification sent');
});
