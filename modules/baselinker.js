const post = require('../utils/fetch');

class BL {
  static async getOrders(params = {}) {
    try {
      const { data } = await post('getOrders', params);
      return data;
    } catch (err) {
      return err;
    }
  }

  static async getOrderStatusList() {
    try {
      const { data } = await post('getOrderStatusList');
      return data;
    } catch (err) {
      throw err;
    }
  }

  static async getOrdersByStatus(statusId) {
    return BL.getOrders({
      status_id: statusId,
    });
  }

  static async getOrderWhereStatus(statusToFind) {
    try {
      const { statuses } = await BL.getOrderStatusList();
      const status = statuses.find(({ name }) => name === statusToFind);
      if (!status) {
        return new Error(`Cannot find status: ${statusToFind}`);
      }
      const { orders } = await BL.getOrdersByStatus(status.id);
      return orders;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BL;
