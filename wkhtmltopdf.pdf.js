const wkhtmltopdf = require('wkhtmltopdf');


async function createPdf() {
  let start = Date.now();
  
  await wkhtmltopdf('https://www.baidu.com', { output: 'dist/baidu.pdf' });
  
  
  console.log(`pdf: ${Date.now() - start} ms`);
}

setInterval(createPdf, 8000);
