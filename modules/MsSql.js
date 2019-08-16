const sql = require('mssql');

const Logger = require('../utils/loggerUtil');

class MsSql {
  static async connect(config) {
    const {
      user, pass, server, dbName,
    } = config;
    try {
      Logger.info('Connect to DB');
      const url = `mssql://${user}:${pass}@${server}/${dbName}`;
      await sql.connect(url);
    } catch (err) {
      Logger.error('Cannot connect to DB');
      throw err;
      // ... error checks
    }
  }

  static close() {
    sql.close();
  }

  static async query(query) {
    Logger.info('Get data from DB');
    try {
      const result = await sql.query(query);
      return result.recordset;
    } catch (err) {
      Logger.error('Cannot get data from DB');
      throw err;
    }
  }

  static async getGroup(name) {
    Logger.info('Get group from DB');
    if (!name) {
      return null;
    }
    try {
      const result = await sql.query`select * FROM sl_GrupaTw WHERE grt_Nazwa = ${name}`;
      if (result.recordset.length) {
        const [{ grt_Id: id }] = result.recordset;
        return id;
      }
      return null;
    } catch (err) {
      Logger.error('Cannot get groups from DB');
      throw err;
    }
  }
}

module.exports = MsSql;
