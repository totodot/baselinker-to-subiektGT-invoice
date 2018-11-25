require('winax');

class SubiektGT {
  constructor(config) {
    this.config = config;
    this.instance = null;
  }

  connect() {
    try {
      const {
        user, pass, server, dbName, operator, operatorPass,
      } = this.config;
      const gt = new ActiveXObject('InsERT.GT');
      gt.Uzytkownik = user;
      gt.UzytkownikHaslo = pass;
      gt.Serwer = server;
      gt.Baza = dbName;
      gt.Operator = operator;
      gt.OperatorHaslo = operatorPass;
      const instance = gt.Uruchom();
      SubiektGT.instance = instance;
      return instance;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = SubiektGT;
