const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices["iPhone 8"];

module.exports = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  
  const page = await browser.newPage();
  //await page.setViewport({width:1920, height:1080});
  await page.emulate(iPhone);
  await page.goto(url, {waitUntil: ['load', 'networkidle0']});
  
  await page.screenshot({
    path: `dist/screenshot_${Date.now()}.jpg`,
    fullPage: true
  })

  browser.close();
};

