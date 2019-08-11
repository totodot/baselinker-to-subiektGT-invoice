const Logger = require('../utils/loggerUtil');

class MagentoIntegrator {
  constructor(config, GT) {
    Logger.info('MagentoInegrator Instacne created!');
    this.config = config;
    this.GT = GT;
  }

  run() {
    console.log(this.config);
  }
}

MagentoIntegrator.instance = null;

module.exports = MagentoIntegrator;
