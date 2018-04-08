const log4js = require('log4js');
const incomingWebhookService = require('./incoming-webhook.service');

const logger = log4js.getLogger('message parser service');

function isPhpMatch(str) {
  str = str.toLowerCase();
  if (str.indexOf('php') !== -1) {
    return true;
  }
  return false;
}

module.exports.parse = (message) => {
  if (isPhpMatch(message)) {
    logger.info(`dead puppie found in message: ${message}`);
    // increment counter in database
    incomingWebhookService.send('oh, hello');
  }
};

