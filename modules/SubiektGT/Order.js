const GT = require('../Subiekt');
const OrderItem = require('./OrderItem');
const Customer = require('./Customer');
const { orderCategoryId } = require('../../config');
const BL = require('../Baselinker');
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

  setComment() {
    const {
      orderId,
      comments: { userComments },
    } = this.order;
    const comment = `
    ID zamówienia baselinker: ${orderId}
    ${userComments ? `\r\nKomentarz użytkownika: ${userComments}` : ''}`;
    this.orderGt.Uwagi = comment;
  }

  addTransport() {
    const position = this.orderGt.Pozycje.DodajUslugeJednorazowa();
    position.UslJednNazwa = 'Usługa logistyczna';
    position.WartoscBruttoPoRabacie = Number((this.orderPrice - this.productsPrice).toFixed(2));
    position.IloscJm = 1;
    position.Jm = 'szt.';
    return position;
  }

  setPayment() {
    const { payment } = this.order;
    if (payment === this.orderPrice) {
      this.orderGt.PlatnoscPrzelewKwota = this.orderGt.KwotaDoZaplaty;
      return;
    }
    if (payment === 0) {
      this.orderGt.PlatnoscKredytKwota = this.orderGt.KwotaDoZaplaty;
      const date = new Date();
      date.setDate(date.getDate() + 8);
      this.orderGt.PlatnoscKredytTermin = date;
      return;
    }

    throw new Error(Logger.translate('orderInvalidPaymentAmmount'));
  }

  updateBLdata(packingStatusId) {
    const { orderId } = this.order;
    try {
      BL.setOrderAdminComments(
        orderId,
        `${this.order.comments.adminComments || ''}\r\n${this.orderGt.NumerPelny}`,
      );
      BL.setOrderStatus(orderId, packingStatusId);
    } catch (err) {
      console.log(err);
    }
  }

  create() {
    try {
      this.orderGt = GT.instance.SuDokumentyManager.DodajZK();
      this.orderGt.LiczonyOdCenBrutto = true;
      this.orderGt.KontrahentId = this.customer.getId();
      if (orderCategoryId !== undefined) {
        this.orderGt.KategoriaId = orderCategoryId;
      }
      this.products.forEach(product => this.addProduct(product));
      this.addTransport();
      this.setPayment();
      this.setComment();
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
      return true;
    } catch (err) {
      Logger.error(err.message);
      this.clear();
      return false;
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
