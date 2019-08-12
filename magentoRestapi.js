const axios = require('axios');
const token = 'token';
axios.defaults.baseURL = 'http://store.swiecisie.pl/rest/V1';
axios.defaults.headers.common = { Authorization: `bearer ${token}` };

const simpleData = [
  {
    sku: 'led_14W_wc',
    price: '14',
    name: 'Lampka ledowa 14W zimny biały',
    qty: 2
  },
  {
    sku: 'led_14W_ww',
    price: '55',
    name: 'Lampka ledowa 14W cieply biały',
    qty: 5
  }
];

const getProduct = async sku => {
  try {
    const result = await axios.get(`/products/${sku}`);
    return result.data;
  } catch (err) {
    throw err;
  }
};

const postProduct = async data => {
  try {
    const result = await axios.post(`/products`, { product: data });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const createProduct = async ({ name, sku, price, qty }) => {
  try {
    const result = await postProduct({
      name,
      sku,
      price,
      attribute_set_id: 4,
      status: 0,
      visibility: 4,
      type_id: 'simple',
      extension_attributes: {
        category_links: [
          {
            position: 0,
            category_id: '42'
          }
        ],
        stock_item: {
          qty,
          is_in_stock: qty !== 0
        }
      }
    });
    return result;
  } catch (err) {
    throw err;
  }
};

const updateProduct = async ({ name, sku, price, qty }) => {
  try {
    const result = await postProduct({
      name,
      sku,
      price,
      extension_attributes: {
        stock_item: {
          qty,
          is_in_stock: qty !== 0
        }
      }
    });
    return result;
  } catch (err) {
    throw err;
  }
};

const needUpdate = (product, data) => {
  if (Number(product.price) !== Number(data.price)) {
    return true;
  }
  if (
    Number(product.qty) !== Number(data.extension_attributes.stock_item.qty)
  ) {
    return true;
  }

  return false;
};

const run = async () => {
  const start = new Date();
  console.log(`Find ${simpleData.length} products`);
  const items = {
    toCreate: 0,
    created: 0,
    toUpdate: 0,
    updated: 0
  };
  for (productIndex in simpleData) {
    console.log(`${Number(productIndex) + 1}/${simpleData.length}`);
    const product = simpleData[productIndex];
    let data = null;
    let error = null;
    try {
      data = await getProduct(product.sku);
    } catch (err) {
      if (err.response.status === 404) {
        console.log('Not item found');
      } else {
        console.log(err);
        error = err;
      }
    }

    if (error) {
      continue;
    }

    if (data && needUpdate(product, data)) {
      items.toUpdate++;
      try {
        await updateProduct(product);
        items.updated++;
      } catch (err) {
        console.log('Cannot update product');
      }
    }

    if (!data) {
      items.toCreate++;
      try {
        await createProduct(product);
        items.created++;
      } catch (err) {
        console.log('Cannot create product');
      }
    }
  }

  console.log(`Created ${items.created}/${items.toCreate}`);
  console.log(`Updated ${items.updated}/${items.toUpdate}`);
  const end = new Date() - start;
  console.info('Execution time: %ds', end / 1000);
};

run();
