// const { getProducts, getProductsPrice } = require('../utils/orderUtils');
const Customer = require('./Customer');
const Product = require('./Product');
const OrderItem = require('./OrderItem');

class Order {
  constructor(order, subiekt) {
    const { products } = order;
    this.subiekt = subiekt;
    this.order = order;
    // this.products = getProducts(products);
    // this.productsPrice = getProductsPrice(products);
    this.customer = null;
    this.products = [];
  }

  createZK() {
    this.customer = new Customer(this.order, this.subiekt);
    const customerId = this.customer.add();
    if (customerId) {
      global.GtFile.json.clients.push(customerId);
      global.GtFile.save();
      console.log('OK', customerId);
    } else {
      console.log('NOT OK');
    }

    if (this.customer.customerGt) {
      this.addProducts();
    }
  }

  addProducts() {
    const { products } = this.order;
    if (products.length === 0) {
      throw new Error('Zamówienie nie posiada produktów');
    }
    this.products = products.map(product => new OrderItem(product, this.subiekt));
  }
}

module.exports = Order;
