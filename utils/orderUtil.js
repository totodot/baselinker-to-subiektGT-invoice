const separator = ',';
const quantitySeparator = ' x';
const quantityRegex = new RegExp(`${quantitySeparator}(\\d+)`);

const reduceSymbol = (sku) => {
  const skuParts = sku.split(separator);
  return skuParts.reduce((prev, next) => {
    const productsQuantities = {
      ...prev,
    };
    const splited = next
      .trim()
      .split(quantityRegex)
      .filter(a => a !== '');
    let qtn = 1;
    if (splited.length > 1) {
      qtn = splited.pop();
    }
    const SKU = splited.join(quantitySeparator).trim();
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

module.exports = reduceSymbol;
