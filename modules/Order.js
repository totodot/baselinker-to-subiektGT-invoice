const { getProducts, getProductsPrice } = require('../utils/orderUtils');

class Order {
  constructor(order) {
    const { products } = order;
    this.order = order;
    this.products = getProducts(products);
    this.productsPrice = getProductsPrice(products);
    console.log(this.productsPrice);
  }

  createZK(subiekt) {
    console.log(this.order);
  }
}

module.exports = Order;
