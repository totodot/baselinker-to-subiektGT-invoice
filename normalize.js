const BigNumber = require('bignumber.js');

function strip(number) {
  return parseFloat(number).toPrecision(12);
}
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

// const mapProducts = products.map(product => ({
//   obj: product,
//   price: new BigNumber(product.price),
//   quantity: product.quantity,
// }));

const getTotalPrice = () => products.reduce((prev, next) => prev.plus(next.price.times(next.quantity)), new BigNumber(0));

console.log(products[0].price.toNumber(), products[0].quantity);
console.log(products[1].price.toNumber(), products[1].quantity);
console.log(
  cost
    .minus(getTotalPrice())
    .times(100)
    .toNumber(),
);
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

console.log(products[0].price.toNumber(), products[0].quantity);
console.log(products[1].price.toNumber(), products[1].quantity);
console.log(getTotalPrice().toNumber());
