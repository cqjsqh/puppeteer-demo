const puppeteerPool = require('./puppeteer-pool');
const devices = require('puppeteer/DeviceDescriptors');

const device = devices["iPhone 8"];
const pool  = puppeteerPool({ // 全局只应该被初始化一次
  puppeteerArgs: {
    ignoreHTTPSErrors: true,
    headless: true, // 是否启用无头模式页面
    timeout: 0,
    pipe: true, // 不使用 websocket
  }
});


module.exports = async (url) => {
  const page = await pool.use(async instance => await instance.newPage());

  await page.emulate(device);
  await page.goto(url, {waitUntil: ['load', 'networkidle0']});

  await page.screenshot({
    path: `dist/screenshot_${Date.now()}.jpg`,
    fullPage: true
  })

  page.close();
};
