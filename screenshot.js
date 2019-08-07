const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices["iPhone 8"];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  const page = await browser.newPage();
  //await page.setViewport({width:1920, height:1080});
  await page.emulate(iPhone);
  await page.goto("https://3gqq.qq.com", {waitUntil: ['load', 'networkidle0']});
  
  await page.screenshot({
    path: 'dist/3gqq.jpg',
    fullPage: true
  })
  await browser.close();
})();