const { reduceSku } = require('../utils/orderUtils');

const Product = require('./Product');

class OrderItem {
  constructor(item, subiekt) {
    this.item = item;
    this.subiekt = subiekt;
    this.productsGt = [];
    this.getProducts();
  }

  getProducts() {
    const {
      sku, name, quantity, price_brutto,
    } = this.item;
    if (sku === '') {
      throw new Error(`Element zamówienia ${name}: nie posiada SKU!!!`);
    }
    this.products = reduceSku(sku);
    const productsEntries = Object.entries(this.products);
    if (productsEntries.length === 1) {
      const [SKU, QNT] = productsEntries[0];
      const product = new Product(SKU, name, this.subiekt);
      product.quantity = QNT * quantity;
      product.price = price_brutto / QNT;
      this.productsGt.push(product);
    } else {
      // this.productsGt = productsEntries.map(product => )
      // const a = productsEntries.map(product => [...product,])
      // console.log(productsEntries);
      // console.log(price_brutto);
    }
  }
}

module.exports = OrderItem;
