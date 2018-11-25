const GT = require('./SubiektGT');

class Product {
  constructor(symbol, quantity, price = 0) {
    this.symbol = symbol;
    this.price = price;
    this.priceGt = null;
    this.quantity = quantity;
    this.productGt = null;

    this.checkExist();
  }

  checkExist() {
    const { symbol } = this;
    if (!symbol) {
      throw new Error('Towar - nie posiada kodu symbol!!!');
    }
    if (GT.instance.Towary.Istnieje(symbol)) {
      this.productGt = GT.instance.Towary.Wczytaj(symbol);
      this.priceGt = Number(this.productGt.Ceny.Element(1).Brutto);
      this.name = this.productGt.Nazwa;
    } else {
      throw new Error(`Kod symbol: ${symbol} nie istnieje w systemie!!!`);
    }
  }

  getPriceGt() {
    return this.priceGt;
  }

  setPrice(price) {
    this.price = Number(price.toFixed(2));
  }

  addPrice(price) {
    this.price = Number((price + this.getPrice()).toFixed(2));
  }

  getPrice() {
    return this.price;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  getQuantity() {
    return this.quantity;
  }

  getCost() {
    return Number((this.price * this.quantity).toFixed(2));
  }
}

module.exports = Product;
