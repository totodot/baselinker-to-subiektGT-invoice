class Product {
  constructor(sku, qnt, subiekt) {
    this.subiekt = subiekt;
    this.sku = sku;
    this.price = 0;
    this.quantity = qnt;
    this.ProductGt = null;

    this.checkExist();
  }

  checkExist() {
    const { sku, name } = this;
    if (!sku) {
      throw new Error('Towar - nie posiada kodu SKU!!!');
    }
    if (this.subiekt.Towary.Istnieje(sku)) {
      this.productGt = this.subiekt.Towary.Wczytaj(sku);
      this.priceGt = this.productGt.Ceny.Element(1).Brutto;
      this.name = this.productGt.Nazwa;
    } else {
      throw new Error(`Kod sku: ${sku} nie istnieje w systemie!!!`);
    }
  }

  getPriceGt() {
    return this.priceGt;
  }

  setPrice(price) {
    this.price = price;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  getQuantity() {
    return this.quantity;
  }
}

module.exports = Product;
