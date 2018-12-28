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

const KurierReg = new RegExp('(kurier|kurierska)');
const PaczkomatyReg = new RegExp('(paczkomaty|paczkomat)');
const PobranieReg = new RegExp('(pobranie|pobraniowa|pobraniowo)');
const AllegroRex = new RegExp('allegro');

const getDeliveryName = (name) => {
  const lowerCased = name.toLocaleLowerCase();
  const isKurier = KurierReg.test(lowerCased);
  const isPaczkomat = PaczkomatyReg.test(lowerCased);
  const isAllegro = AllegroRex.test(lowerCased);
  const isPobranie = PobranieReg.test(lowerCased);
  const newName = [
    isKurier ? 'Kurier' : null,
    isPaczkomat ? 'Paczkomaty' : null,
    isAllegro ? 'Allegro' : null,
    isPobranie ? 'Pobranie' : null,
  ]
    .filter(word => word)
    .join(' ');

  return newName || 'Usługa Logistyczna';
};

module.exports = { reduceSymbol, getDeliveryName };
