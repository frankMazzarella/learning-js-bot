const log4js = require('log4js');
const messageParserService = require('../services/message-parser.service');

const logger = log4js.getLogger('slack controller');

module.exports.actionEndpoint = (req, res) => {
  if (req.body.type === 'url_verification') {
    logger.info('handling slack url_verification');
    res.sendStatus(req.body.challenge);
    return;
  }

  res.sendStatus(200);
  const { event } = req.body;
  switch (event.type) {
    case 'message':
      if (event.subtype === 'bot_message') return;
      messageParserService.parse(event.text);
      break;

    default:
      logger.warn(`received unknown type: ${event.type}`);
      break;
  }
};
