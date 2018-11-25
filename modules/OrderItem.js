const BigNumber = require('bignumber.js');
const Logger = require('../utils/loggerUtil');
const { reduceSku } = require('../utils/orderUtils');
const Product = require('./Product');
const Combo = require('./Combo');

class OrderItem {
  constructor(item) {
    this.name = item.name;
    this.price = item.price;
    this.quantity = item.quantity;
    this.symbol = item.symbol || '';
    this.item = null;
    this.setProducts();
  }

  setProducts() {
    const { symbol, name, price } = this;
    if (symbol === '') {
      throw new Error(Logger.translate('orderitemNoSymbol', { name }));
    }
    const products = Object.entries(reduceSku(symbol));

    // this.products = productsEntries.map(([SKU, QNT]) => new Product(SKU, QNT, this.subiekt));

    if (products.length === 1) {
      const [productSymbol, productQuantity] = products[0];
      this.item = new Product(productSymbol, productQuantity);
      this.item.setPrice(price / productQuantity);
    } else {
      this.item = new Combo(products, price);
    }
  }

  // getProducts() {
  //   return this.products;
  // }

  // updateQuantity() {
  //   this.products.forEach((product) => {
  //     product.quantity *= this.quantity;
  //   });
  // }
}

module.exports = OrderItem;
