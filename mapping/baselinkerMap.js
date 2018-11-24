module.exports = ({
  user_login: login,
  phone,
  email,
  user_comments: comments,
  delivery_price: deliveryPrice,
  invoice_fullname: invoiceFullname,
  invoice_company: invoiceCompany,
  invoice_nip: invoiceNip,
  invoice_address: invoiceAddress,
  invoice_city: invoiceCity,
  invoice_postcode: invoicePostcode,
  invoice_country: invoiceCountry,
  products,
}) => ({
  deliveryPrice,
  customer: {
    login,
    phone,
    email,
    comments,
    invoiceFullname,
    invoiceCompany,
    invoiceNip,
    invoiceAddress,
    invoiceCity,
    invoicePostcode,
    invoiceCountry,
  },
  products: products.map(({
    name, sku: symbol, price_brutto: price, quantity,
  }) => ({
    name,
    symbol,
    price,
    quantity,
  })),
});