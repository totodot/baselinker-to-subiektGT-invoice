const BigNumber = require('bignumber.js');

class Product {
  constructor(sku, qnt, subiekt) {
    this.subiekt = subiekt;
    this.sku = sku;
    this.price = new BigNumber(0);
    this.quantity = qnt;
    this.ProductGt = null;

    this.checkExist();
  }

  checkExist() {
    const { sku, name } = this;
    if (!sku) {
      throw new Error('Towar - nie posiada kodu SKU!!!');
    }
    if (this.subiekt.Towary.Istnieje(sku)) {
      this.productGt = this.subiekt.Towary.Wczytaj(sku);
      this.priceGt = new BigNumber(this.productGt.Ceny.Element(1).Brutto);
      this.name = this.productGt.Nazwa;
    } else {
      throw new Error(`Kod sku: ${sku} nie istnieje w systemie!!!`);
    }
  }

  getPriceGt() {
    return this.priceGt.toNumber();
  }

  setPrice(price) {
    this.price = new BigNumber(price.toFixed(2));
  }

  getPrice() {
    return this.price.toNumber();
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  getQuantity() {
    return this.quantity;
  }

  getCost() {
    return this.price.times(this.quantity).toNumber();
  }
}

module.exports = Product;
