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
      return data.statuses;
    } catch (err) {
      throw err;
    }
  }

  static async checkStatusesExists(zkStatus, packageStatus) {
    try {
      const data = await BL.getOrderStatusList();
      const ZKS = data.find(({ name }) => name === zkStatus);
      if (!ZKS) {
        return new Error(Logger.translate('Cannot find status: {status}', { status: zkStatus }));
      }
      const PS = data.find(({ name }) => name === packageStatus);
      if (!PS) {
        return new Error(
          Logger.translate('Cannot find status: {status}', { status: packageStatus }),
        );
      }
      return [ZKS, PS];
    } catch (err) {
      throw err;
    }
  }

  static async getOrdersByStatus(statusId) {
    return BL.getOrders({
      status_id: statusId,
    });
  }

  static async getOrderWhereStatus(statusId) {
    try {
      const { orders } = await BL.getOrdersByStatus(statusId);
      return orders;
    } catch (err) {
      throw err;
    }
  }

  static async setOrderAdminComments(orderId, comment) {
    try {
      const { data } = await POST('setOrderFields', {
        order_id: orderId,
        admin_comments: comment,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }

  static async setOrderStatus(orderId, statusId) {
    try {
      const { data } = await POST('setOrderStatus', {
        order_id: orderId,
        status_id: statusId,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }

  static async getProductsData(storageId, products) {
    try {
      const { data } = await POST('getProductsData', {
        storage_id: storageId,
        products,
      });
      return data.products;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BL;
