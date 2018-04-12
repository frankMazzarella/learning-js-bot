const { IncomingWebhook } = require('@slack/client');
const log4js = require('log4js');

const logger = log4js.getLogger('message parser service');

module.exports.send = (message) => {
  const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  webhook.send(message, (err) => {
    if (err) {
      logger.error(err);
      return;
    }
    logger.info('dead puppy notification sent');
  });
};
