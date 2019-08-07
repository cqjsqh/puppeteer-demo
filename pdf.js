//const puppeteer = require('puppeteer');
const puppeteerPool = require('./puppeteer-pool');

const pool  = puppeteerPool({ // 全局只应该被初始化一次
  puppeteerArgs: {
    ignoreHTTPSErrors: true,
    headless: true, // 是否启用无头模式页面
    timeout: 0,
    pipe: true, // 不使用 websocket
  }
});


async function createPdf() {
  let start = Date.now();
  
  //const browser = await puppeteer.launch();
  //const page = await browser.newPage();
  const page = await pool.use(async instance => await instance.newPage());
  
  await page.goto("https://www.baidu.com");
  await page.waitForSelector('body');
  
  await page.pdf({                     // 测试比wkhtmltopdf慢  phantomjs
    path: 'dist/baidu.pdf',
    format: 'A4',
    printBackground:  true,
    
  });
  
  console.log(`pdf: ${Date.now() - start} ms`);
  page.close();
}


setInterval(createPdf, 8000);
