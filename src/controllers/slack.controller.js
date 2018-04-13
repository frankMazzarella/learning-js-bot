const log4js = require('log4js');
const messageParserService = require('../services/message-parser.service');
const incomingWebhookService = require('../services/incoming-webhook.service');
const dataService = require('../services/data.service');

const { db } = dataService;
const logger = log4js.getLogger('slack controller');

function handleDeadPuppy(messageEvent) {
  logger.info(messageEvent);
  const responseMessage = 'Woah there cowboy! :face_with_cowboy_hat: ' +
    'You better watch your fucking mouth before I tell my mom.';

  db(dataService.tables.VIOLATION)
    .insert({
      user: messageEvent.user,
      message: messageEvent.text,
      channel: messageEvent.channel,
    })
    .then(() => {
      logger.info('PHP violation stored in database');
      // TODO: count how many times user has kill, and how many times killed per channel
      incomingWebhookService.send(responseMessage);
    })
    .catch(error => logger.error(error.sqlMessage));
}

module.exports.actionEndpoint = (req, res) => {
  if (req.body.type === 'url_verification') {
    logger.info('handling slack url_verification');
    res.send(req.body.challenge);
    return;
  }

  res.sendStatus(200);
  const { event } = req.body;
  switch (event.type) {
    case 'message':
      if (event.subtype) return;
      if (messageParserService.isPhpMatch(event.text)) {
        handleDeadPuppy(event);
      }
      break;

    default:
      logger.warn(`received unknown type: ${event.type}`);
      break;
  }
};
