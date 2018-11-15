const { getProducts, getProductsPrice } = require('../utils/orderUtils');
const { nipIsValid, removeSeparator } = require('../utils/nip');

class Customer {
  constructor(customer, subiekt) {
    this.subiekt = subiekt;
    this.customer = customer;

    this.customerGT = null;

    this.nip = customer.invoice_nip.replace(/ /g, '');
    this.isCompany = customer.invoice_company !== '' && this.nip !== '';

    if (this.isCompany) {
      this.checkExist();
    }
  }

  readCustomer(nip) {
    if (this.subiekt.Kontrahenci.Istnieje(nip)) {
      this.customerGT = this.subiekt.Kontrahenci.Wczytaj(nip);
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
      this.customerGt.NazwaPelna = `${invoice_company} ${invoice_fullname}`;
      this.customerGt.OsobaImie = firstName;
      this.customerGt.OsobaNazwisko = secondNames.join(' ');
      this.customerGt.Osoba = 1;
    }

    const addressParts = invoice_address.split(' ');
    const addressNumber = addressParts.pop();

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
      if (this.customerGT) {
        throw new Error('Nie można dodać klienta dla tego obiektu, klient już istieje!');
      }
      this.customerGt = this.subiekt.Kontrahenci.Dodaj();
      this.setGTObject();
      console.log(`Tworzenie klienta ${this.customerGt.Email}`);
      // TODO comment
      // this.customerGt.Zapisz();
      // console.log(`Utworzono klienta: ${this.customerGt.Symbol}`);
      // return this.customerGt.Identyfikator;
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = Customer;
