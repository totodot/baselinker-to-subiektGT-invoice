const { zkStatusName, packingStatusName, subiektGT: subiektGTConfig } = require('./config');
const Order = require('./modules/SubiektGT/Order');
const BL = require('./modules/Baselinker');
const SubiektGT = require('./modules/Subiekt');
const mapping = require('./maps/baselinkerMap');
const Logger = require('./utils/loggerUtil');

const GT = new SubiektGT(subiektGTConfig);
GT.connect();

const findSkuInfeatures = (features) => {
  let SKU = null;
  features.forEach(([key, value]) => {
    if (key === 'sku') {
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
  const products = await BL.getProductsData(1, noSkuIds);
  const productsSkus = Object.keys(products).reduce(
    (prev, id) => ({
      ...prev,
      [id]: findSkuInfeatures(products[id].features) || null,
    }),
    {},
  );
  orders.forEach(({ products }) => {
    products.forEach((product) => {
      const { sku, product_id } = product;
      if (!sku) {
        product.sku = productsSkus[product_id] || '';
      }
    });
  });
  return orders;
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
