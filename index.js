const Order = require('./modules/Order');
const { statusName } = require('./config');
const BL = require('./modules/baselinker');

const getOrders = async () => {
  try {
    const orders = await BL.getOrderWhereStatus(statusName);
    return orders;
  } catch (err) {
    return err;
  }
};

getOrders().then((orders) => {
  orders.forEach((order) => {
    new Order(order);
  });
});
