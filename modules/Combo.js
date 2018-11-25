const Product = require('./Product');

class Combo {
  constructor(items, price) {
    this.items = items;
    this.price = price;
    this.products = [];
    this.setProducts();
  }

  getFactor() {
    const cost = this.products.reduce((prev, product) => {
      const productPrice = product.getPriceGt();
      const productQuantity = product.getQuantity();
      return prev + productPrice * productQuantity;
    }, 0);
    return this.price / cost;
  }

  setProducts() {
    this.products = this.items.map(([symbol, quantity]) => new Product(symbol, quantity));
    const factor = this.getFactor();
    this.products.forEach((product) => {
      product.setPrice(product.getPriceGt() * factor);
    });

    this.fitPrices();
  }

  getTotalPrice() {
    return this.products.reduce((prev, next) => Number((prev + next.getCost()).toFixed(2)), 0);
  }

  fitPrices() {
    let change = true;
    while (change) {
      change = false;
      this.products.forEach((product) => {
        const diff = Number(((this.price - this.getTotalPrice()) * 100).toFixed(2));
        const absDiff = Math.abs(diff);
        if (absDiff % product.getQuantity() === 0 && absDiff !== 0) {
          product.addPrice(diff / product.getQuantity() / 100);
          change = true;
        }
      });
    }

    change = true;
    while (change) {
      change = false;
      this.products.forEach((product) => {
        const diff = Number(((this.getTotalPrice() - this.price) * 100).toFixed(2));
        const priceToAdd = Math.floor(diff / product.quantity);
        if (priceToAdd !== 0) {
          product.addPrice(priceToAdd / 100);
          change = true;
        }
      });
    }
  }
}

module.exports = Combo;
