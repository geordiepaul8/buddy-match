const pino = require('pino')
const logger = pino({
  prettyPrint: {colorize: true}
});

module.exports = logger;