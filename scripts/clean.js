const fs = require('fs');
const path = require('path');

const target = [
  "index.browser.js",
  "index.browser.d.ts",
  "index.browser.d.ts.map",
  "index.browser.js.map",
  "index.node.js",
  "index.node.d.ts",
  "index.node.d.ts.map",
  "index.node.js.map",
  "lib",
  "constants"
];
for(const t of target) {
  const p = path.resolve(__dirname, "..", t);
  if(!fs.existsSync(p)) {
    continue;
  } else if(fs.statSync(p).isDirectory()) {
    fs.rmdirSync(p, {
      recursive: true,
    });
  } else {
    fs.unlinkSync(p);
  }
}