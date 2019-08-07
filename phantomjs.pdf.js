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


async function createPdf() {
  let start = Date.now();
  
  
  const page = await pool.use(async instance => await instance.createPage());
  
  const status = await page.open("https://www.baidu.com")

  if (status === 'success') {
    await page.render('dist/baidu.pdf')
  }
  
  console.log(`pdf: ${Date.now() - start} ms`);
}

setInterval(createPdf, 8000);
