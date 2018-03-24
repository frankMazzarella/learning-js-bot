const logger = require('log4js');

logger.getLogger('slack controller');

module.exports.actionEndpoint = (req, res) => {
  logger.info(req);
};
