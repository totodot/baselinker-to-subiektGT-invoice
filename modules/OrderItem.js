const { reduceSku } = require('../utils/orderUtils');

const Product = require('./Product');

class OrderItem {
  constructor(item, subiekt) {
    this.item = item;
    this.price = item.price_brutto;
    this.quantity = item.quantity;
    this.subiekt = subiekt;
    this.productsGt = [];
    this.setProducts();
  }

  getMnoznik() {
    const cost = this.productsGt
      .map(productGt => [productGt.getPriceGt(), productGt.getQuantity()])
      .reduce((prev, [price, quantity]) => prev + price * quantity, 0);

    return this.price / cost;
  }

  setProducts() {
    const { sku, name } = this.item;
    if (sku === '') {
      throw new Error(`Element zamówienia ${name}: nie posiada SKU!!!`);
    }
    this.products = reduceSku(sku);
    const productsEntries = Object.entries(this.products);
    this.productsGt = productsEntries.map(([SKU, QNT]) => new Product(SKU, QNT, this.subiekt));

    if (this.productsGt.length === 1) {
      const product = this.productsGt[0];
      const quantity = product.quantity;
      const price = this.price;
      product.setPrice(price / quantity);
    } else {
      const mnoznik = this.getMnoznik();
      this.productsGt.forEach((productGt) => {
        productGt.setPrice(productGt.getPriceGt() * mnoznik.toFixed(2) * 1);
      });

      this.updateQuantity();
    }
  }

  getProducts() {
    return this.productsGt;
  }

  updateQuantity() {
    this.productsGt.forEach((product) => {
      product.quantity *= this.quantity;
    });
  }
}

module.exports = OrderItem;
