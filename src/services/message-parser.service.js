const log4js = require('log4js');
const incomingWebhookService = require('./incoming-webhook.service');

const logger = log4js.getLogger('message parser service');
const responseMessage = 'Woah there cowboy! :face_with_cowboy_hat: ' +
  'You better watch your fucking mouth before I tell my mom.';

function isPhpMatch(str) {
  const lowercaseStr = str.toLowerCase();
  if (lowercaseStr.indexOf('php') !== -1) {
    return true;
  }
  return false;
}

module.exports.parse = (message) => {
  if (isPhpMatch(message)) {
    logger.info(`dead puppy found in message: ${message}`);
    incomingWebhookService.send(responseMessage);
  }
};
