const { POST } = require('../utils/fetchUtil');
const Logger = require('../utils/loggerUtil');

class BL {
  static async getOrders(params = {}) {
    try {
      const { data } = await POST('getOrders', params);
      return data;
    } catch (err) {
      return err;
    }
  }

  static async getOrderStatusList() {
    try {
      const { data } = await POST('getOrderStatusList');
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
        return new Error(
          Logger.translate('Cannot find status: {status}', { status: statusToFind }),
        );
      }
      const { orders } = await BL.getOrdersByStatus(status.id);
      return orders;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BL;
