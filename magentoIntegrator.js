// require('colors');
const sql = require('mssql');
const { subiektGT: subiektGTConfig } = require('./config');
// const SubiektGT = require('./modules/Subiekt');
// const MagentoIntegrator = require('./modules/MagentoIntegrator');
// const mapping = require('./maps/baselinkerMap');
// const Logger = require('./utils/loggerUtil');

// const GT = new SubiektGT(subiektGTConfig);

// try {
//   Logger.info('Połączenie do SUBIEKT GT');
//   const GtInstance = GT.connect();
//   // const Magento = new MagentoIntegrator({}, GtInstance);
// } catch (e) {
//   Logger.info('Błąd połączenia do SUBIEKT GT');
// }
const {
  user, pass, server, dbName,
} = subiektGTConfig;

const connect = async () => {
  try {
    const url = `mssql://${user}:${pass}@${server}/${dbName}`;
    console.log(url);
    await sql.connect(url);
    const result = await sql.query`select tw_Symbol as code,
                                  tw_Id as id, st_Stan as stan,
                                  tw_Nazwa as nazwa,
                                  tc_CenaBrutto1 as brutto1,
                                  tc_CenaBrutto2 as brutto2
                                  FROM vwTowar WHERE tw_SklepInternet = 1`;
    console.log(result);

    sql.close();
  } catch (err) {
    console.log(err);
    // ... error checks
  }
};

connect();
