const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  const page = await browser.newPage();
  //await page.setViewport({width:1920, height:1080});
  await page.goto("https://www.baidu.com");
  
  await page.waitForSelector('body');
  await page.pdf({
    path: 'dist/baidu.pdf',
    format: 'A4',
    printBackground:  true,
    
  });
  await browser.close();
})();
// 测试比wkhtmltopdf慢