require('colors');
const { zkStatusName, packingStatusName, subiektGT: subiektGTConfig } = require('./config');
const Order = require('./modules/SubiektGT/Order');
const BL = require('./modules/Baselinker');
const SubiektGT = require('./modules/Subiekt');
const mapping = require('./maps/baselinkerMap');
const Logger = require('./utils/loggerUtil');

const GT = new SubiektGT(subiektGTConfig);

const findSkuInfeatures = (features) => {
  let SKU = null;
  features.forEach(([key, value]) => {
    if (key === 'sku' || key === 'SKU') {
      SKU = value;
    }
  });
  return SKU;
};

const getNoSkuIds = products => products.reduce((prev, { product_id, sku }) => {
  const next = [...prev];
  if (!sku) {
    next.push(product_id);
  }
  return next;
}, []);

const getFullData = async (orders) => {
  const noSkuIds = orders.reduce((prev, { products }) => [...prev, ...getNoSkuIds(products)], []);
  if (noSkuIds.length === 0) {
    return orders;
  }
  const products = await BL.getProductsData(1, noSkuIds);
  const productsSkus = Object.keys(products).reduce(
    (prev, id) => ({
      ...prev,
      [id]: findSkuInfeatures(products[id].features) || '',
    }),
    {},
  );
  return orders.map(order => ({
    ...order,
    products: order.products.map((product) => {
      const { sku, product_id } = product;
      return {
        ...product,
        sku: sku || productsSkus[product_id],
      };
    }),
  }));
};

const getBaselinkerData = async () => {
  try {
    const [zkStatus, packingStatus] = await BL.checkStatusesExists(zkStatusName, packingStatusName);
    const orders = await BL.getOrderWhereStatus(zkStatus.id);
    const fullOrders = await getFullData(orders);
    return {
      orders: fullOrders.map(order => mapping(order)),
      packingStatus,
    };
  } catch (err) {
    console.log(err);
  }
};

try {
  console.log('Połączenie do SUBIEKT GT');
  GT.connect();
} catch (e) {
  console.log('Błąd połączenia do SUBIEKT GT');
  console.log(e);
}
getBaselinkerData()
  .then(({ orders, packingStatus }) => {
    const len = orders.length;
    let success = 0;
    Logger.info('findOrders', { length: len });
    orders.forEach((order, current) => {
      Logger.info('orderStartElement', { current: current + 1, all: len });
      const orderGt = new Order(order);
      const created = orderGt.createZK();
      if (created) {
        orderGt.updateBLdata(packingStatus.id);
        success++;
      }
      console.log('\n');
    });
    Logger.info('orderStatus');
    console.log(`${`${len}`.blue} / ${`${success}`.green} / ${`${len - success}`.red}`);
  })
  .catch((err) => {
    console.log(err);
  });
