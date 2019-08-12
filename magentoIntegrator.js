require('colors');
const { subiektGT: subiektGTConfig } = require('./config');
const MsSql = require('./modules/MsSql');
const MagentoRun = require('./modules/MagentoIntegrator');
const Logger = require('./utils/loggerUtil');

const run = async () => {
  try {
    await MsSql.connect(subiektGTConfig);
    const groupId = await MsSql.getGroup('GREENLUX');
    const result = await MsSql.query(`select tw_Symbol as sku,
                              tw_Id as id, st_Stan as qty,
                              tw_Nazwa as name,
                              tc_CenaBrutto4 as price,
                              tc_CenaBrutto5 as bruttoAllegro,
                              tw_PodstKodKresk as ean
                              FROM vwTowar WHERE tw_SklepInternet = 1
                              AND tw_IdGrupa = ${groupId}`);
    MagentoRun(result);
  } catch (err) {
    console.error(err);
  }
};

run()
  .then(() => {
    MsSql.close();
  })
  .catch(() => {
    MsSql.close();
  });
