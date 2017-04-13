const request = require('request');
const express = require('express');
const app = express();

const port = process.env.APP_PORT || 3000;
const kv = process.env.KV_ROOT || 'http://infra1:8500/v1/kv';
const root = '/menu';

// const brewsUrl = 'http://1.0.0.brews.ps.com/brews';
// const roastsUrl = 'http://1.0.0.roasts.ps.com/roasts';

app.get(root, (req, res) => {
  let menu = [];
  get(`${kv}/routes/brews?raw`).then((url) => {
    return get(url);
  }, error(res)).then((brews) => {
    menu.push(JSON.parse(brews));
    return get(`${kv}/routes/roasts?raw`);
  }, error(res)).then((url) => {
    return get(url);
  }, error(res)).then((roasts) => {
    menu.push(JSON.parse(roasts));
    return res.json(permutations(menu[0], menu[1]));
  }, error(res)).catch((err) => {
    console.trace(err);
    return res.send(err);
  });
});

app.listen(port);
console.log(`Listening on port: ${port}`);
console.log(`Using key/value store: ${kv}`);

function get(url) {
  return new Promise((resolve, reject) => {
    return request(url, (err, res, body) => {
      if (err) return reject(err);
      return resolve(body);
    });
  });
}

function error(res) {
  return (e) => {
    console.trace(e);
    return res.send(e);
  }
}

function permutations() {
  var r = [], arg = arguments, max = arg.length-1;
  function helper(arr, i) {
    for (var j=0, l=arg[i].length; j<l; j++) {
      var a = arr.slice(0);
      a.push(arg[i][j]);
      if (i==max)
        r.push({
          brew: a[0],
          roast: a[1]
        });
      else
        helper(a, i+1);
    }
  }
  helper([], 0);
  return r;
}
