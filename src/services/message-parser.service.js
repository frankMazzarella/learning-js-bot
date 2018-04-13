const log4js = require('log4js');

const logger = log4js.getLogger('message parser service');

module.exports.isPhpMatch = (str) => {
  const lowercaseStr = str.toLowerCase();
  if (lowercaseStr.indexOf('php') !== -1) {
    logger.info(`dead puppy found in message: ${str}`);
    return true;
  }
  return false;
};
