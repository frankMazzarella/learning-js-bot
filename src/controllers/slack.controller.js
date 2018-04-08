const log4js = require('log4js');
const messageParser = require('../services/message-parser.service');

const logger = log4js.getLogger('slack controller');

module.exports.actionEndpoint = (req, res) => {
  if (req.body.type === 'url_verification') {
    logger.info('handling slack url_verification');
    res.send(req.body.challenge);
    return;
  }

  const { event } = req.body;
  switch (event.type) {
    case 'message':
      res.sendStatus(200);
      logger.info(`someone said: ${event.text}`);
      messageParser.parse(event.text);
      break;

    default:
      res.sendStatus(200);
      logger.info(`received unknown type: ${event.type}`);
      break;
  }
};
