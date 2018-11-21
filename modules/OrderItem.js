const BigNumber = require('bignumber.js');
const { reduceSku } = require('../utils/orderUtils');
const Product = require('./Product');

class OrderItem {
  constructor(item, subiekt) {
    this.item = item;
    this.price = item.price_brutto;
    this.quantity = item.quantity;
    this.subiekt = subiekt;
    this.products = [];
    this.setProducts();
  }

  getMnoznik() {
    const cost = this.products
      .map(productGt => [productGt.getPriceGt(), productGt.getQuantity()])
      .reduce((prev, [price, quantity]) => prev + price * quantity, 0);

    return this.price / cost;
  }

  getTotalPrice() {
    return this.products.reduce((prev, next) => prev.plus(next.getCost()), new BigNumber(0));
  }

  normalize() {
    let change = true;
    while (change) {
      change = false;
      this.products.forEach((product) => {
        const diff = new BigNumber(this.price).minus(this.getTotalPrice()).times(100);
        console.log(diff.toNumber());
        const absDiff = diff.abs().toNumber();
        if (absDiff % product.getQuantity() === 0 && absDiff !== 0) {
          product.setPrice(product.getPrice() + diff / product.getQuantity() / 100);
          change = true;
        }
      });
    }

    change = true;
    while (change) {
      change = false;
      this.products.forEach((product) => {
        const diff = this.getTotalPrice()
          .minus(this.price)
          .times(100)
          .toNumber();
        const a = Math.floor(diff / product.quantity);
        if (a !== 0) {
          product.setPrice(product.getPrice() + a / 100);
          change = true;
        }
      });
    }
  }

  setProducts() {
    const { sku, name } = this.item;
    if (sku === '') {
      throw new Error(`Element zamówienia ${name}: nie posiada SKU!!!`);
    }
    const productsEntries = Object.entries(reduceSku(sku));
    this.products = productsEntries.map(([SKU, QNT]) => new Product(SKU, QNT, this.subiekt));

    if (this.products.length === 1) {
      const product = this.products[0];
      const quantity = product.quantity;
      const price = this.price;
      product.setPrice(price / quantity);
    } else {
      const mnoznik = this.getMnoznik();
      this.products.forEach((productGt) => {
        productGt.setPrice(productGt.getPriceGt() * mnoznik);
      });

      if (this.products.length > 1) {
        this.normalize();
      }

      this.updateQuantity();
    }
  }

  getProducts() {
    return this.products;
  }

  updateQuantity() {
    this.products.forEach((product) => {
      product.quantity *= this.quantity;
    });
  }
}

module.exports = OrderItem;
