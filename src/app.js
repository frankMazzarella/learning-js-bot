require('dotenv').config();
const log4js = require('log4js');
const os = require('os');
const { IncomingWebhook } = require('@slack/client');

const logger = log4js.getLogger();
logger.level = 'info';
logger.info('app stared');

const timeNotification = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
const currentTime = new Date().toUTCString();
const message = `Service v${process.env.npm_package_version} has started at ${currentTime}
    on ${os.hostname} ${os.platform}`;

timeNotification.send(message, (err) => {
  if (err) {
    logger.error(err);
    return;
  }
  logger.info('notification sent');
});
