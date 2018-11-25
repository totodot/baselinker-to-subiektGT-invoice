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
    this.orderPrice = Number(
      this.order.products
        .reduce(
          (price, next) => price + next.price_brutto * next.quantity,
          this.order.delivery_price,
        )
        .toFixed(2),
    );
  }

  addProduct(product) {
    const { sku } = product;
    const position = this.orderGt.Pozycje.Dodaj(sku);
    position.IloscJm = product.getQuantity();
    position.WartoscBruttoPoRabacie = product.getCost();
    return position;
  }

  addTransport() {
    const position = this.orderGt.Pozycje.DodajUslugeJednorazowa();
    position.UslJednNazwa = 'Usługa logistyczna';
    position.WartoscBruttoPoRabacie = Number((this.orderPrice - this.productsPrice).toFixed(2));
    position.IloscJm = 1;
    position.Jm = 'szt.';
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
      this.addTransport();
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
      // if (!this.customer.customerGt) {
      //   this.customer.add();
      // }
      // this.create();
      // console.log('Zamówienie stworzono pomyślnie!!!'.green);
    } catch (err) {
      console.log(err);
      console.log(`${err.message}`.red);
    }
  }

  getProducts() {
    const { products } = this.order;
    if (products.length === 0) {
      throw new Error('Zamówienie nie posiada produktów');
    }
    this.products = products.reduce((prev, product) => {
      const orderItem = new OrderItem({
        name: product.name,
        symbol: product.sku,
        price: product.price_brutto,
        quantity: product.quantity,
      });
      // return [...prev, ...orderItem.getProducts()];
    }, []);

    // this.productsPrice = Number(
    //   this.products
    //     .reduce((price, next) => price + next.getPrice() * next.getQuantity(), 0)
    //     .toFixed(2),
    // );

    // console.log(`Zamówienie: produktów: ${this.products.length}`);
  }
}

module.exports = Order;
