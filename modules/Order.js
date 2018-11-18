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

  addProduct(product) {
    const { sku, quantity, price } = product;
    const position = this.orderGt.Pozycje.Dodaj(sku);
    position.IloscJm = quantity;
    position.WartoscBruttoPoRabacie = price * quantity;
    return position;
  }

  create() {
    try {
      this.orderGt = this.subiekt.SuDokumentyManager.DodajZK();
      this.orderGt.LiczonyOdCenBrutto = true;
      this.orderGt.KontrahentId = this.customer.customerGt.Identyfikator;
      this.products.forEach((product) => {
        this.addProduct(product);
      });
      this.orderGt.Zapisz();
    } catch (err) {
      if (err.description) {
        throw new Error(`SUBIEKT_GT_ERROR_: ${err.description}`);
      }
      throw err;
    }
  }

  createZK() {
    try {
      this.customer = new Customer(this.order, this.subiekt);
      this.getProducts();
      if (!this.customer.customerGt) {
        this.customer.add();
      }
      this.create();
      console.log('Zamówienie stworzono pomyślnie!!!'.green);
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
  }
}

module.exports = Order;
