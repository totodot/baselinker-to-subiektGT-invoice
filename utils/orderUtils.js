const separator = ',';
const quantitySeparator = ' x';

const reduceSku = (sku) => {
  const skuParts = sku.split(separator);
  return skuParts.reduce((prev, next) => {
    const productsQuantities = {
      ...prev,
    };
    const [sku, qtn = 1] = next.trim().split(quantitySeparator);
    const SKU = sku.trim();
    const QTN = Number(qtn);
    if (!Number.isInteger(QTN) || QTN === '') {
      throw new Error(`Incorect SKU: ${next.trim()}`);
    }
    if (!sku) {
      return productsQuantities;
    }
    if (productsQuantities[SKU]) {
      productsQuantities[SKU] += QTN;
    } else {
      productsQuantities[SKU] = QTN;
    }
    return productsQuantities;
  }, {});
};

const getProducts = (products) => {
  const obj = products.reduce((prev, next) => {
    const productsQuantities = {
      ...prev,
    };
    if (!next.sku || next.sku === '') {
      throw new Error(`Not SKU for product ${next.name}`);
    }
    const skuProducts = reduceSku(next.sku);

    Object.entries(skuProducts).forEach(([SKU, QTN]) => {
      if (productsQuantities[SKU]) {
        productsQuantities[SKU] += QTN;
      } else {
        productsQuantities[SKU] = QTN;
      }
    });
    return productsQuantities;
  }, {});
  return obj;
};

const getProductsPrice = products => products.reduce((prev, next) => prev + next.price_brutto * next.quantity, 0);

module.exports = { getProducts, getProductsPrice, reduceSku };
