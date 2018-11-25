const { statusName, subiektGT: subiektGTConfig } = require('./config');
const Order = require('./modules/SubiektGT/Order');
const BL = require('./modules/Baselinker');
const SubiektGT = require('./modules/Subiekt');
const mapping = require('./maps/baselinkerMap');
const Logger = require('./utils/loggerUtil');

const GT = new SubiektGT(subiektGTConfig);
GT.connect();

const getOrders = async () => {
  try {
    const orders = await BL.getOrderWhereStatus(statusName);

    return orders.map(order => mapping(order));
  } catch (err) {
    throw err;
  }
};

getOrders()
  .then((orders) => {
    const len = orders.length;
    orders.forEach((order, current) => {
      Logger.info('orderStartElement', { current: current + 1, all: len });
      const orderGt = new Order(order);
      orderGt.createZK();
      console.log('\n');
    });
  })
  .catch((err) => {
    console.log(err);
  });
