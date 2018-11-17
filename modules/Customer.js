const colors = require('colors');
const { getProducts, getProductsPrice } = require('../utils/orderUtils');
const { nipIsValid, removeSeparator } = require('../utils/nip');

class Customer {
  constructor(customer, subiekt) {
    this.subiekt = subiekt;
    this.customer = customer;

    this.customerGt = null;

    this.nip = customer.invoice_nip.replace(/ /g, '');
    this.isCompany = customer.invoice_company !== '' && this.nip !== '';

    if (this.isCompany) {
      this.checkExist();
    }
  }

  readCustomer(nip) {
    if (this.subiekt.Kontrahenci.Istnieje(nip)) {
      console.log('Klient istnieje w bazie danych'.yellow);
      console.log(`NIP: ${this.nip}`.yellow);
      this.customerGt = this.subiekt.Kontrahenci.Wczytaj(nip);
      return true;
    }
    return false;
  }

  checkExist() {
    if (this.readCustomer(this.nip)) {
      return;
    }
    this.nip = removeSeparator(this.nip);
    this.readCustomer(this.nip);
  }

  setGTObject() {
    const {
      phone,
      email,
      invoice_fullname,
      invoice_company,
      invoice_address,
      invoice_city,
      invoice_postcode,
    } = this.customer;

    if (this.isCompany) {
      if (invoice_company.length === 0) {
        throw new Error('Nie można utworzyć klienta brak jego nazwy!');
      }
      if (!nipIsValid(this.nip)) {
        throw new Error('Nie można utworzyć klineta, zły NIP');
      }
      this.customerGt.NazwaPelna = `${invoice_company} ${invoice_fullname}`;
      this.customerGt.Nazwa = invoice_company.slice(0, 40);
      this.customerGt.Osoba = 0;
      this.customerGt.NIP = this.nip;
      this.customerGt.Symbol = this.nip;
    } else {
      if (invoice_fullname.length === 0) {
        throw new Error('Nie można utworzyć klienta brak jego nazwy!');
      }
      const [firstName, ...secondNames] = invoice_fullname.split(' ');
      this.customerGt.NazwaPelna = `${invoice_company} ${invoice_fullname}`.trim();
      this.customerGt.Osoba = 1;
      this.customerGt.OsobaImie = firstName;
      this.customerGt.OsobaNazwisko = secondNames.join(' ');
    }

    const addressParts = invoice_address.split(' ');
    const addressNumber = addressParts.pop();

    this.customerGt.GrupaId = 3;
    this.customerGt.Email = email;
    this.customerGt.Miejscowosc = invoice_city.replace(/,/g, '');
    this.customerGt.KodPocztowy = invoice_postcode;
    this.customerGt.Ulica = addressParts.join(' ').replace(/,/g, '');

    const [nr1, nr2] = addressNumber.split('/');

    this.customerGt.NrDomu = nr1;
    if (nr2) {
      this.customerGt.NrLokalu = nr2;
    }

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
      if (this.customerGt) {
        console.log('Nie można dodać klienta dla tego obiektu, klient już istnieje!'.yellow);
        return this.customerGt.symbol;
      }
      this.customerGt = this.subiekt.Kontrahenci.Dodaj();
      this.setGTObject();
      console.log(`Tworzenie klienta ${this.customerGt.Email}`.yellow);
      this.customerGt.Zapisz();
      console.log(`Utworzono klienta: ${this.customerGt.Symbol}`.green);
      return this.customerGt.Symbol;
    } catch (err) {
      if (err.description) {
        throw new Error(`SUBIEKT_GT_ERROR_: ${err.description}`);
      }
      throw err;
    }
  }
}

module.exports = Customer;
