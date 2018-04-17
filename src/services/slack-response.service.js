const { WebClient } = require('@slack/client');
const log4js = require('log4js');

// TODO: tokens are different for each workspace. this will only be able to
// respond to one workspace at a time.
const logger = log4js.getLogger('slack response service');

module.exports.respond = (message, channel, accessToken) => {
  const webClient = new WebClient(accessToken);
  const response = { text: message, channel };
  webClient.chat.postMessage(response)
    .then(() => logger.info('response message sent to slack'))
    .catch(error => logger.info(error));
};
