const puppeteer = require('puppeteer');
const fs = require('fs');
const util = require('util');

(async () => {
  const browser = await puppeteer.launch();
  
  const page = await browser.newPage();
  
  await page._client.send('Network.emulateNetworkConditions', { // 3G Slow
    offline: false,
    latency: 200, // ms
    downloadThroughput: 780 * 1024 / 8, // 780 kb/s
    uploadThroughput: 330 * 1024 / 8, // 330 kb/s
  });
  await page._client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  
  await page.tracing.start({ path: "dist/trace.json"} );
  await page.goto("https://www.baidu.com");
  await page.tracing.stop();
  await extractDataFromTracing("dist/trace.json", "dist/trace.resource.json");
  
  const performanceTiming = await page.evaluate(() => JSON.stringify(window.performance.timing, null , 2));
  await util.promisify(fs.writeFile)("dist/performanceTiming.json", performanceTiming);
  
  await browser.close();
})();


async function extractDataFromTracing(path, dist) {
  let resource = {};
  const tracing = await util.promisify(fs.readFile)(path).then(data => JSON.parse(data));
  
  for(var i=0,len=tracing.traceEvents.length;i<len;i++) {
    let x = tracing.traceEvents[i];
    
    if (x.cat === 'devtools.timeline' && typeof x.args.data !== 'undefined' && typeof x.args.data.requestId !== 'undefined') {
      let requestId = x.args.data.requestId;
      resource[requestId] = resource[requestId] || { requestId };
      
      if (x.name === 'ResourceSendRequest') {
        resource[requestId].start = {
          ts: x.ts,
          name: x.name,
          url: x.args.data.url,
          requestMethod: x.args.data.requestMethod,
        };
      } else if (x.name === 'ResourceFinish') {
        resource[requestId].end = {
          ts: x.ts,
          name: x.name,
          encodedDataLength: x.args.data.encodedDataLength,
          decodedBodyLength: x.args.data.decodedBodyLength,
        };
      }
      
    }
    
  }
  
  await util.promisify(fs.writeFile)(dist, JSON.stringify(resource, null , 2));
  
  return resource;
}
