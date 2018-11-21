const BigNumber = require('bignumber.js');

const cost = new BigNumber(13.76);
const products = [
  {
    price: new BigNumber(1.01),
    quantity: 9,
  },
  {
    price: new BigNumber(2.39),
    quantity: 2,
  },
];

const getTotalPrice = () => products.reduce((prev, next) => prev.plus(next.price.times(next.quantity)), new BigNumber(0));

let change = true;

while (change) {
  change = false;
  products.forEach((product) => {
    const diff = cost.minus(getTotalPrice()).times(100);
    const absDiff = diff.abs().toNumber();
    if (absDiff % product.quantity === 0 && absDiff !== 0) {
      product.price = product.price.plus(diff.dividedBy(product.quantity).dividedBy(100));
      change = true;
    }
  });
}

change = true;
while (change) {
  change = false;
  products.forEach((product) => {
    const diff = cost
      .minus(getTotalPrice())
      .times(100)
      .toNumber();
    const a = Math.floor(diff / product.quantity);
    if (a !== 0) {
      product.price = product.price.plus(a / 100);
      change = true;
    }
  });
}
