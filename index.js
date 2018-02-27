#!/usr/bin/env node

const os = require('os');
const du = require('diskusage');
const program = require('commander');
const request = require('request');

let path = os.platform() === 'win32' ? 'c:' : '/';
let url = 'https://icarus.zerodaedalus.com/tracker'

const params = {
  load: os.loadavg(),
  freeMem: os.freemem(),
  totalMem: os.totalmem(),
  hostname: os.hostname(),
  uptime: os.uptime(),
  disk: du.checkSync(path),
};

program
  .option('-d, --dev', 'Run in dev mode')
  .option('-l, --local', 'Run in local mode')
  .option('-p, --port [port]', 'Specify a port to use')
  .parse(process.argv);

if (program.local) {
  url = `http://localhost${program.port ? ':' + program.port : ''}/tracker`;
} else if (program.dev) {
  url = 'https://suraci.zerodaedalus.com/tracker';
}

console.log('Sending params');
request.post(url, params, (err, res, body) => {
  if (err) console.log(err);
  if (res) console.log(res && res.statusCode);
  if (body) console.log(body);
});

