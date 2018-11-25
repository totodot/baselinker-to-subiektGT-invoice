const Product = require('./Product');
const Combo = require('./Combo');
const Logger = require('../../utils/loggerUtil');
const reduceSymbol = require('../../utils/orderUtil');

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
    const products = Object.entries(reduceSymbol(symbol));

    if (products.length === 1) {
      const [productSymbol, productQuantity] = products[0];
      this.item = new Product(productSymbol, productQuantity);
      this.item.setPrice(price / productQuantity);
    } else {
      this.item = new Combo(products, price);
    }
  }

  getProducts() {
    const { item, quantity } = this;
    const className = item.getClassName();
    const products = className === 'Combo' ? item.getProducts() : [item.getProduct()];
    return products.map(product => ({
      ...product,
      quantity: product.quantity * quantity,
    }));
  }
}

module.exports = OrderItem;
