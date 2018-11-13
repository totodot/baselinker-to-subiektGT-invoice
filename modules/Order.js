const { getProducts, getProductsPrice } = require('../utils/orderUtils');

class Order {
  constructor(order) {
    const { products } = order;
    this.products = getProducts(products);
    this.productsPrice = getProductsPrice(products);
    console.log(this.productsPrice);
  }
}

module.exports = Order;
