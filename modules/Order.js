// const { getProducts, getProductsPrice } = require('../utils/orderUtils');
const colors = require('colors');
const Customer = require('./Customer');
const Product = require('./Product');
const OrderItem = require('./OrderItem');

class Order {
  constructor(order, subiekt) {
    console.log(`Przetwarzanie zamówienia od ${order.email}`.green);
    this.subiekt = subiekt;
    this.order = order;
    this.customer = null;
    this.products = [];
  }

  createZK() {
    try {
      this.customer = new Customer(this.order, this.subiekt);
      this.getProducts();
      if (!this.customer.customerGt) {
        this.customer.add();
      }
    } catch (err) {
      console.log(`${err.message}`.red);
    }
  }

  getProducts() {
    const { products } = this.order;
    if (products.length === 0) {
      throw new Error('Zamówienie nie posiada produktów');
    }
    this.products = products.reduce((prev, product) => {
      const orderItem = new OrderItem(product, this.subiekt);
      return [...prev, ...orderItem.getProducts()];
    }, []);

    console.log(`Zamówienie: produktów: ${this.products.length}`);
    console.log(this.products);
  }
}

module.exports = Order;
