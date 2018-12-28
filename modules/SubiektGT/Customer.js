const GT = require('../Subiekt');
const { customerCaregoryId } = require('../../config');
const Logger = require('../../utils/loggerUtil');
const { nipIsValid, removeSeparator, getNipVariants } = require('../../utils/nipUtil');

class Customer {
  constructor(customer) {
    this.customer = customer;
    this.customerGt = null;
    this.nip = removeSeparator(this.customer.invoiceNip);
    this.isCompany = this.customer.invoiceCompany !== '' && this.nip !== '';

    if (this.isCompany && nipIsValid(this.nip)) {
      this.customerGt = this.checkExist();
    }
  }

  setCustomerName(company, fullName) {
    if (this.isCompany) {
      if (company.length === 0) {
        throw new Error(Logger.translate('customerNoName'));
      }
      if (!nipIsValid(this.nip)) {
        throw new Error(Logger.translate('customerInvalidNIP'));
      }
      this.customerGt.NazwaPelna = `${company} ${fullName}`;
      this.customerGt.Nazwa = company.slice(0, 40);
      this.customerGt.Osoba = 0;
      this.customerGt.NIP = this.nip;
      this.customerGt.Symbol = this.nip;
      this.customerGt.CzynnyPodatnikVAT = true;
      this.customerGt.OdbiorcaDetaliczny = false;
    } else {
      if (fullName.length === 0) {
        throw new Error(Logger.translate('customerNoName'));
      }
      const [firstName, ...secondNames] = fullName.split(' ');
      this.customerGt.NazwaPelna = `${company} ${fullName}`.trim();
      this.customerGt.Osoba = 1;
      this.customerGt.OsobaImie = firstName;
      this.customerGt.OsobaNazwisko = secondNames.join(' ');
      this.customerGt.CzynnyPodatnikVAT = false;
      this.customerGt.OdbiorcaDetaliczny = true;
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

    if (customerCaregoryId !== undefined) {
      this.customerGt.GrupaId = customerCaregoryId;
    }

    return true;
  }

  checkExist() {
    const nips = getNipVariants(this.nip);
    for (let i = 0; i < nips.length; i += 1) {
      if (GT.instance.Kontrahenci.Istnieje(nips[i])) {
        Logger.info('customerExist', { nip: nips[i] });
        return GT.instance.Kontrahenci.Wczytaj(nips[i]);
      }
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

  remove() {
    const { email } = this.customer;
    try {
      if (this.customerGt) {
        Logger.info('customerRemove', { email });
        this.customerGt.Usun();
        Logger.success('customerRemoved', { email });
      }
    } catch (err) {
      Logger.error(err.message);
    }
  }

  getId() {
    return this.customerGt.Identyfikator;
  }
}

module.exports = Customer;
