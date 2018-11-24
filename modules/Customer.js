const GT = require('./SubiektGT');
const mapping = require('../mapping/baselinkerMap');
const Logger = require('../utils/loggerUtil');
const { nipIsValid, removeSeparator } = require('../utils/nipUtil');

class Customer {
  constructor(order) {
    this.customer = mapping(order).customer;
    this.customerGt = null;
    this.nip = removeSeparator(this.customer.invoiceNip);
    this.isCompany = this.customer.invoiceCompany !== '' && this.nip !== '';

    if (this.isCompany) {
      this.customerGt = this.checkExist();
    }
  }

  // Set Subiekt GT object

  setCustomerName(company, fullName) {
    if (this.isCompany) {
      if (company.length === 0) {
        throw new Error(Logger('customerNoName'));
      }
      if (!nipIsValid(this.nip)) {
        throw new Error(Logger('customerInvalidNIP'));
      }
      this.customerGt.NazwaPelna = `${company} ${fullName}`;
      this.customerGt.Nazwa = company.slice(0, 40);
      this.customerGt.Osoba = 0;
      this.customerGt.NIP = this.nip;
      this.customerGt.Symbol = this.nip;
    } else {
      if (fullName.length === 0) {
        throw new Error(Logger('customerNoName'));
      }
      const [firstName, ...secondNames] = fullName.split(' ');
      this.customerGt.NazwaPelna = `${company} ${fullName}`.trim();
      this.customerGt.Osoba = 1;
      this.customerGt.OsobaImie = firstName;
      this.customerGt.OsobaNazwisko = secondNames.join(' ');
    }
  }

  setCustomerAddress(address, city, postcode) {
    const addressParts = address.split(' ');
    const addressNumber = addressParts.pop();

    this.customerGt.Miejscowosc = city.replace(/,/g, '');
    this.customerGt.KodPocztowy = postcode;
    this.customerGt.Ulica = addressParts.join(' ').replace(/,/g, '');

    const [nr1, nr2] = addressNumber.split('/');

    this.customerGt.NrDomu = nr1;
    if (nr2) {
      this.customerGt.NrLokalu = nr2;
    }
  }

  setCustomerContact(email, phone) {
    this.customerGt.Email = email;
    if (phone) {
      const phoneGt = this.customerGt.Telefony.Dodaj(phone);
      phoneGt.Nazwa = 'Primary';
      phoneGt.Numer = phone;
      phoneGt.Typ = 3;
    }
  }

  setGTObject() {
    const {
      email,
      invoiceAddress,
      invoiceCity,
      invoiceCompany,
      invoiceFullname,
      invoicePostcode,
      phone,
    } = this.customer;

    this.setCustomerName(invoiceCompany, invoiceFullname);
    this.setCustomerAddress(invoiceAddress, invoiceCity, invoicePostcode);
    this.setCustomerContact(email, phone);

    // TODO add to config
    this.customerGt.GrupaId = 3;

    return true;
  }

  checkExist() {
    if (GT.instance.Kontrahenci.Istnieje(this.nip)) {
      Logger.info('customerExist', { nip: this.nip });
      return GT.instance.Kontrahenci.Wczytaj(this.nip);
    }
    return null;
  }

  add() {
    try {
      if (this.customerGt) {
        Logger.info('customerCanNotAdd');
        return this.customerGt.symbol;
      }
      this.customerGt = GT.instance.Kontrahenci.Dodaj();
      this.setGTObject();
      Logger.info('customerCreate', { email: this.customerGt.email });
      this.customerGt.Zapisz();
      Logger.success('customerCreated', { symbol: this.customerGt.symbol });
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
