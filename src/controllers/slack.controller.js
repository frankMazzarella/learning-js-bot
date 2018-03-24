const log4js = require('log4js');

const logger = log4js.getLogger('slack controller');

module.exports.actionEndpoint = (req, res) => {
  logger.info(`receiving slack action type: ${req.body.type}`);
  res.send(req.body.challenge);
};
