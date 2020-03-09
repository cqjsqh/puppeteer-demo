const express = require('express')
const screenshot = require('./screenshot')
const quickScreenshot = require('./quick-screenshot')
const phantomjsScreenshot = require('./phantomjs-screenshot')

const app = express()
const PORT = 3000



app.get('/screenshot',async (req, res) => {
  await screenshot('https://3gqq.qq.com');
  res.send('ok')
});

app.get('/screenshot/quick',async (req, res) => {
  await quickScreenshot('https://3gqq.qq.com');
  res.send('ok')
});

app.get('/screenshot/phantomjs',async (req, res) => {
  await phantomjsScreenshot('https://3gqq.qq.com');
  res.send('ok')
});



app.listen(PORT, () =>
  console.log(`server listening on port ${PORT}`)
);