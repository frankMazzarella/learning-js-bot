const log4js = require('log4js');
const messageParserService = require('../services/message-parser.service');
const slackResponseService = require('../services/slack-response.service');
const dataService = require('../services/data.service');

const { db } = dataService;
const logger = log4js.getLogger('slack controller');

// TODO: refactor all of this fucking vomit code

function handleDeadPuppy(messageEvent) {
  db(dataService.tables.VIOLATION)
    .insert({
      user: messageEvent.user,
      message: messageEvent.text,
      channel: messageEvent.channel,
    })
    .then(() => {
      logger.info('PHP violation stored in database');
      Promise
        .all([
          db.raw(`SELECT COUNT(*) FROM violation WHERE user='${messageEvent.user}'
            AND channel='${messageEvent.channel}'`),
          db.raw(`SELECT COUNT(*) FROM violation WHERE channel='${messageEvent.channel}'`),
        ])
        .then((res) => {
          const userKillCount = res[0][0][0]['COUNT(*)'];
          const channelKillCount = res[1][0][0]['COUNT(*)'];
          const responseMessage = 'Your actions require the sacrifice of `one adorable puppy`\n' +
            `You have killed ${userKillCount} of ${channelKillCount} puppies.`;
          slackResponseService.respond(responseMessage, messageEvent.channel);
        })
        .catch(error => logger.error(error.sqlMessage));
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
