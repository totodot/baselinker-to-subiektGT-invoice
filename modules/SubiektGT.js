require("winax");

class SubiektGT {
  constructor(config) {
    this.config = config;
    this.instance = null;
  }

  connect() {
    try {
      const {
        user,
        pass,
        server,
        dbName,
        operator,
        operatorPass
      } = this.config;
      const gt = new ActiveXObject("InsERT.GT");
      // gt.Autentykacja = 0;
      // gt.Produkt = InsERT.gtaProduktSubiekt
      gt.Uzytkownik = user;
      gt.UzytkownikHaslo = pass;
      gt.Serwer = server;
      gt.Baza = dbName;
      gt.Operator = operator;
      gt.OperatorHaslo = operatorPass;
      this.instance = gt.Uruchom();
      return this.instance;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = SubiektGT;
