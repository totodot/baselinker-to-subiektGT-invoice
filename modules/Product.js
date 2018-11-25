const GT = require('./SubiektGT');
const Logger = require('../utils/loggerUtil');

class Product {
  constructor(symbol, quantity, price = 0) {
    this.className = 'Product';
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
      throw new Error(Logger.translate('productNoSymbol'));
    }
    if (GT.instance.Towary.Istnieje(symbol)) {
      this.productGt = GT.instance.Towary.Wczytaj(symbol);
      this.priceGt = Number(this.productGt.Ceny.Element(1).Brutto);
      this.name = this.productGt.Nazwa;
    } else {
      throw new Error(Logger.translate('productNoExist', { symbol }));
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

  getProduct() {
    const { symbol, price, quantity } = this;
    return {
      symbol,
      price,
      quantity,
    };
  }

  getClassName() {
    return this.className;
  }
}

module.exports = Product;
