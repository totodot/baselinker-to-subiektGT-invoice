const Order = require('./modules/Order');
const { statusName, subiektGT: subiektGTConfig } = require('./config');
const BL = require('./modules/baselinker');
const SubiektGT = require('./modules/SubiektGT');
const Customer = require('./modules/Customer');

const GT = new SubiektGT(subiektGTConfig);
const subiekt = GT.connect();

const getOrders = async () => {
  try {
    const orders = await BL.getOrderWhereStatus(statusName);
    return orders;
  } catch (err) {
    throw err;
  }
};

getOrders()
  .then((orders) => {
    // const a = new Order(orders[1], subiekt);
    // a.createZK();
    const len = orders.length;

    [orders[0]].forEach((order, index) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'.rainbow, `${index + 1}/${len}`);
      // console.log(order);
      const a = new Order(order, subiekt);
      a.createZK(subiekt);
      // console.log('\n');
    });
  })
  .catch((err) => {
    console.log(err);
  });
