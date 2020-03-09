const createPhantomPool = require('phantom-pool');

const pool  = createPhantomPool({
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  maxUses: 50,
  validator: () => Promise.resolve(true),
  testOnBorrow: true,
  phantomArgs: [['--ignore-ssl-errors=true', '--disk-cache=true']],
});


module.exports = async (url) => {
  const page = await pool.use(async instance => await instance.createPage());

  const status = await page.open(url)

  if (status === 'success') {
    setTimeout(async function () {
      await page.render(`dist/screenshot_${Date.now()}.jpg`)
    }, 3000)
  }
};
