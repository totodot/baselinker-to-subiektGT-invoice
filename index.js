const { zkStatusName, packingStatusName, subiektGT: subiektGTConfig } = require('./config');
const Order = require('./modules/SubiektGT/Order');
const BL = require('./modules/Baselinker');
const SubiektGT = require('./modules/Subiekt');
const mapping = require('./maps/baselinkerMap');
const Logger = require('./utils/loggerUtil');

const GT = new SubiektGT(subiektGTConfig);
GT.connect();

const getBaselinkerData = async () => {
  try {
    const [zkStatus, packingStatus] = await BL.checkStatusesExists(zkStatusName, packingStatusName);
    const orders = await BL.getOrderWhereStatus(zkStatus.id);
    return {
      orders: orders.map(order => mapping(order)),
      packingStatus,
    };
  } catch (err) {
    console.log(err);
  }
};

getBaselinkerData()
  .then(({ orders, packingStatus }) => {
    const len = orders.length;
    orders.forEach((order, current) => {
      Logger.info('orderStartElement', { current: current + 1, all: len });
      const orderGt = new Order(order);
      const created = orderGt.createZK();
      if (created) {
        orderGt.updateBLdata(packingStatus.id);
      }
      console.log('\n');
    });
  })
  .catch((err) => {
    console.log(err);
  });
