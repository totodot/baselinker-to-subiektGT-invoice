const { getProducts, getProductsPrice } = require('../utils/orderUtils');

class Customer {
  constructor(customer, subiekt) {
    this.subiekt = subiekt;
    this.customer = customer;
  }

  setGTObject() {
    const {
      phone,
      email,
      invoice_fullname,
      invoice_company,
      invoice_nip,
      invoice_address,
      invoice_city,
      invoice_postcode,
      invoice_country,
    } = this.customer;
    const [firstName, ...secondNames] = invoice_fullname.split(' ');
    const addressParts = invoice_address.split(' ');
    const addressNumber = addressParts.pop();
    this.customerGt.Osoba = 1;
    this.customerGt.OsobaImie = firstName;
    this.customerGt.OsobaNazwisko = secondNames.join(' ');
    this.customerGt.NazwaPelna = invoice_fullname;

    this.customerGt.Email = email;
    this.customerGt.Miejscowosc = invoice_city;
    this.customerGt.KodPocztowy = invoice_postcode;
    this.customerGt.Ulica = addressParts.join(' ');
    this.customerGt.NrDomu = addressNumber;
    if (phone) {
      const phoneGt = this.customerGt.Telefony.Dodaj(phone);
      phoneGt.Nazwa = 'Primary';
      phoneGt.Numer = phone;
      phoneGt.Typ = 3;
    }
    return true;
  }

  add() {
    try {
      this.customerGt = this.subiekt.Kontrahenci.Dodaj();
      this.setGTObject();
      console.log(`Tworzenie klienta ${this.customerGt.Email}`);
      this.customerGt.Zapisz();
      console.log(`Utworzono klienta: ${this.customerGt.Symbol}`);
      return this.customerGt.Identyfikator;
    } catch (err) {
      console.log('Nie mozna dodać klienta');
    }
  }
}

module.exports = Customer;
