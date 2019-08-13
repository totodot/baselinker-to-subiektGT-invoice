const axios = require('axios');
const {
  magento: { token, attribute_set_id, category_id },
} = require('../config');

axios.defaults.baseURL = 'http://store.swiecisie.pl/rest/all/V1';
axios.defaults.headers.common = { Authorization: `bearer ${token}` };

const getProduct = async (sku) => {
  try {
    const result = await axios.get(`/products/${encodeURIComponent(sku)}`);
    return result.data;
  } catch (err) {
    throw err;
  }
};

const postProduct = async (data) => {
  try {
    const result = await axios.post('/products', { product: data });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const createProduct = async ({
  name, sku, price, qty, ean,
}) => {
  try {
    const data = {
      name,
      sku,
      price,
      attribute_set_id,
      status: 0,
      visibility: 4,
      type_id: 'simple',
      extension_attributes: {
        category_links: [
          {
            position: 0,
            category_id,
          },
        ],
        stock_item: {
          qty,
          is_in_stock: qty !== 0,
        },
      },
      custom_attributes: [
        {
          attribute_code: 'ean',
          value: ean,
        },
      ],
    };
    const result = await axios.post('/products', { product: data });
    console.log(`Product created ${sku}`);
    return result;
  } catch (err) {
    throw err;
  }
};

const updateProduct = async ({
  name, sku, price, qty, ean,
}) => {
  try {
    const data = {
      name,
      sku,
      price,
      extension_attributes: {
        stock_item: {
          qty,
          is_in_stock: qty !== 0,
        },
      },
      custom_attributes: [
        {
          attribute_code: 'ean',
          value: ean,
        },
      ],
    };
    const result = await axios.put(`/products/${encodeURIComponent(sku)}`, { product: data });
    console.log(`Product updated ${sku}`);
    return result;
  } catch (err) {
    throw err;
  }
};

const needUpdate = (product, data) => {
  if (Number(product.price) !== Number(data.price)) {
    return true;
  }
  if (Number(product.qty) !== Number(data.extension_attributes.stock_item.qty)) {
    return true;
  }
  const eanAttribute = data.custom_attributes.find(
    ({ attribute_code }) => attribute_code === 'ean',
  );
  if (!eanAttribute || (eanAttribute && Number(eanAttribute.value) !== Number(product.ean))) {
    return true;
  }

  return false;
};

const run = async (products) => {
  const start = new Date();
  console.log(`Find ${products.length} products`);
  const items = {
    toCreate: 0,
    created: 0,
    toUpdate: 0,
    updated: 0,
  };
  for (productIndex in products) {
    console.log(`${Number(productIndex) + 1}/${products.length}`);
    const product = products[productIndex];
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

      const create = async (data) => {
        try {
          await createProduct(data);
          items.created++;
        } catch (err) {
          if (err.response.data.message === 'Klucz URL dla wybranego sklepu już istnieje.') {
            create({
              ...data,
              name: `${data.name} new`,
            });
          } else {
            throw err;
          }
        }
      };

      try {
        await create(product);
      } catch (err) {
        console.log(`Cannot create product ${product.name} | ${product.sku}`);
      }
    }
  }

  console.log(`Created ${items.created}/${items.toCreate}`);
  console.log(`Updated ${items.updated}/${items.toUpdate}`);
  const end = new Date() - start;
  console.info('Execution time: %ds', end / 1000);
};

module.exports = run;
