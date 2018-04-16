const log4js = require('log4js');
const messageParserService = require('../services/message-parser.service');
const slackResponseService = require('../services/slack-response.service');
const dataService = require('../services/data.service');
const request = require('request');

const { db } = dataService;
const logger = log4js.getLogger('slack controller');

const tokens = [];


function checkForToken(teamId) {
  const results = tokens.filter(obj => obj.team_id === teamId);
  if (results.length !== 1) {
    if (results.length === 0) {
      /* tokens does not contain entry for teamId */
      logger.error('Did not find an entry for team_id:', teamId);
    } else {
      /* tokens contains multiple entries with for teamId */
      logger.error('Found multiple entries for team_id:', teamId);
    }
    return undefined;
  }
  /* tokens contains entry with teamId */
  return results[0].token;
}

function addTokenToMemory(teamId, accessToken) {
  if (checkForToken(teamId) === undefined) {
    tokens.push({ team_id: teamId, token: accessToken });
    logger.info('Added tokens entry to memory for team_id:', teamId);
  } else {
    logger.error('entry for team_id:', teamId, ' already in memory');
    // db update team entry
  }
}

function addTokenToDatabase(id, accessToken) {
  db(dataService.tables.TEAM)
    .insert({
      teamId: id,
      token: accessToken,
    })
    .then(() => {
      logger.info('Team entry stored in database');
      addTokenToMemory(id, accessToken);
    })
    .catch(error => logger.error(error));
}

// TODO: refactor all of this fucking vomit code

function handleDeadPuppy(messageEvent, teamId) {
  let tokenToUse;
  // Get TeamId from Message and check if we have an access token in memory
  tokenToUse = checkForToken(teamId);
  if (tokenToUse !== undefined) {
    logger.info('Access token retrieved from memory');
  } else {
    // If not, query database for access token.
    db.raw(`SELECT token FROM team WHERE teamId='${teamId}'`)
      .then((data) => {
        // Handle no matching entries
        // If we find the team_id in the table assign associated token
        logger.info('Retrieved token:', data);
        addTokenToMemory(teamId, data);
        tokenToUse = data;
      })
      .catch(error => logger.error(error));
  }

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
          slackResponseService.respond(responseMessage, messageEvent.channel, tokenToUse);
        })
        .catch(error => logger.error(error));
    })
    .catch(error => logger.error(error));
}

module.exports.authEndpoint = (req, res) => {
  const authCode = req.query.code;
  logger.info('received auth redirect with code ', authCode);

  let token;
  let teamId;
  const options = {
    url: 'https://slack.com/api/oauth.access',
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    qs: {
      code: authCode,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    },
  };

  request(options, (err, response, body) => {
    if (err) { logger.error(err); return; }
    logger.info('Get response.statusCode: ', response.statusCode);
    const requestResponse = JSON.parse(body);
    if (requestResponse.error) {
      logger.error('Error requesting access token: ', requestResponse.error);
      res.status(200).send(`<html><body><h3>Error requesting access token:
        ${requestResponse.error}</h3></body></html>`);
    } else {
      logger.info(body);
      token = requestResponse.bot.bot_access_token;
      teamId = requestResponse.team_id;
      addTokenToDatabase(teamId, token);
      res.status(200).send('<html><body><h3>SUCCESS! You just installed my Bot <3</h3></body></html>');
    }
  });
};

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
        handleDeadPuppy(event, req.body.team_id);
      }
      break;

    default:
      logger.warn(`received unknown type: ${event.type}`);
      break;
  }
};
