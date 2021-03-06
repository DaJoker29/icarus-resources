#!/usr/bin/env node

const os = require('os');
const du = require('diskusage');
const program = require('commander');
const request = require('request');

let path = os.platform() === 'win32' ? 'c:' : '/';
let url = 'https://icarus.zerodaedalus.com/resource'

const params = {
  load: os.loadavg()[2],
  usedMem: os.totalmem() - os.freemem(),
  totalMem: os.totalmem(),
  hostname: os.hostname(),
  uptime: os.uptime(),
  usedDisk: du.checkSync(path).total - du.checkSync(path).free,
  totalDisk: du.checkSync(path).total,
};

program
  .option('-d, --dev', 'Run in dev mode')
  .option('-l, --local', 'Run in local mode')
  .option('-p, --port [port]', 'Specify a port to use')
  .parse(process.argv);

if (program.local) {
  url = `http://localhost${program.port ? ':' + program.port : ''}/resource`;
} else if (program.dev) {
  url = 'https://suraci.zerodaedalus.com/resource';
}

console.log(params);
console.log(url);
request.post(url, {body: params, json: true} , (err, res, body) => {
  if (err) console.log(err);
  if (res) console.log(res && res.statusCode);
  if (body) console.log(body);
});

