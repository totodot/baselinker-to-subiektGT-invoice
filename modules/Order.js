const { getProducts, getProductsPrice } = require('../utils/orderUtils');
const Customer = require('./Customer');

class Order {
  constructor(order) {
    const { products } = order;
    this.order = order;
    this.products = getProducts(products);
    this.productsPrice = getProductsPrice(products);
    console.log(this.productsPrice);
  }

  createZK(subiekt) {
    const customer = new Customer(this.order, subiekt);
    if (!customer.customerGT) {
      const customerId = customer.add();
      if (customerId) {
        console.log('OK', customerId);
      } else {
        console.log('NOT OK');
      }
    }
  }
}

module.exports = Order;
