const GT = require('../Subiekt');
const OrderItem = require('./OrderItem');
const Customer = require('./Customer');
const { orderCategoryId } = require('../../config');
const Logger = require('../../utils/loggerUtil');

class Order {
  constructor(order) {
    Logger.info('orderStart', { email: order.customer.email });
    this.order = order;
    this.deliveryPrice = order.deliveryPrice || 0;
    this.customer = null;
    this.products = [];
    this.productsPrice = 0;
    this.orderPrice = Number(
      this.order.products
        .reduce(
          (total, { price = 0, quantity = 1 }) => total + price * quantity,
          this.deliveryPrice,
        )
        .toFixed(2),
    );
  }

  addProduct(product) {
    const { symbol, price, quantity } = product;
    const position = this.orderGt.Pozycje.Dodaj(symbol);
    position.IloscJm = quantity;
    position.WartoscBruttoPoRabacie = Number((price * quantity).toFixed(2));
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
      this.orderGt = GT.instance.SuDokumentyManager.DodajZK();
      this.orderGt.LiczonyOdCenBrutto = true;
      this.orderGt.KontrahentId = this.customer.getId();
      this.orderGt.KategoriaId = orderCategoryId;
      this.products.forEach(product => this.addProduct(product));
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
      const { customer } = this.order;
      this.customer = new Customer(customer);
      this.getProducts();
      if (!this.customer.customerGt) {
        this.customer.add();
      }
      this.create();
      Logger.success('orderCreated');
    } catch (err) {
      Logger.error(err.message);
      console.log(err);
      this.clear();
    }
  }

  clear() {
    if (this.customer.customerGt && !this.customer.isCompany) {
      this.customer.remove();
    }
  }

  getProducts() {
    const { products } = this.order;
    if (products.length === 0) {
      throw new Error(Logger.translate('orderNoProducts'));
    }
    this.products = products.reduce((prev, {
      name, symbol, price, quantity,
    }) => {
      const orderItem = new OrderItem({
        name,
        symbol,
        price,
        quantity,
      });
      return [...prev, ...orderItem.getProducts()];
    }, []);

    this.setProductsPrice();
  }

  setProductsPrice() {
    this.productsPrice = Number(
      this.products.reduce((total, { price, quantity }) => total + price * quantity, 0).toFixed(2),
    );
  }
}

module.exports = Order;
