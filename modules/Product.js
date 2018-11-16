class Product {
  constructor(sku, name, subiekt) {
    this.subiekt = subiekt;
    this.name = name;
    this.sku = sku;
    this.ProductGt = null;

    this.checkExist();
  }

  checkExist() {
    const { sku, name } = this;
    if (!sku) {
      throw new Error(`Towar ${name} - nie posiada kodu SKU!!!`);
    }
    if (this.subiekt.Towary.Istnieje(sku)) {
      this.productGt = this.subiekt.Towary.Wczytaj(sku);
      console.log(this.productGt.Nazwa);
    } else {
      throw new Error(`Kod sku: ${sku} nie istnieje w systemie!!!`);
    }
  }

  getPrice() {
    return this.productGt.Ceny.Element(1).Brutto;
  }
}

module.exports = Product;
