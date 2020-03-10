const createPhantomPool = require('phantom-pool');
const devices = require('puppeteer/DeviceDescriptors');

const device = devices["iPhone 8"];

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

  await page.setting('userAgent', device.userAgent);
  await page.property('viewportSize', {
    width: device.viewport.width * device.viewport.deviceScaleFactor,
    height: device.viewport.height * device.viewport.deviceScaleFactor
  });

  const status = await page.open(url)

  if (status === 'success') {
    await page.evaluate(function(){
      // 白色背景色
      document.body.bgColor = 'white';
      // 给个足够大的值滚动到底部
      window.scrollTo(0,10000);
    });

    await page.render(`dist/screenshot_${Date.now()}.jpg`)
  }
};
