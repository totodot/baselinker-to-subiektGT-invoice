const Order = require('./modules/Order');
const { statusName, subiektGT: subiektGTConfig } = require('./config');
const BL = require('./modules/baselinker');
const SubiektGT = require('./modules/SubiektGT');

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
    orders.forEach((order) => {
      const a = new Order(order);
      a.createZK(subiekt);
    });
  })
  .catch((err) => {
    console.log(err);
  });
