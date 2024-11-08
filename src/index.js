const http = require('http');
const url = require('url');

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const hash = reqUrl.pathname.split('/tx/')[1];

  const stateScan = 'https://laos.statescan.io/#/extrinsics';
  const blockscout = 'https://explorer.laosnetwork.io/tx';
  const invalidHash = '0x52e30adb4948a99fd9c43c11a076b7c31a2f3151f96476f0590c9cde99755efb';

  // if the user makes an invalid request, we redirect them to an invalid tx hash in blockscout
  if (!hash) {
    res.writeHead(302, { 'Location': `${blockscout}/${invalidHash}` });
    res.end();
    return;
  }

  const stateScanApi = `https://laos-api.statescan.io/extrinsics/${hash}`;

  try {
    // if statescan has the tx, redirect to statescan, otherwise to blockscout
    const apiRes = await fetch(stateScanApi);
    if (apiRes.status === 200) {
      res.writeHead(302, { 'Location': `${stateScan}/${hash}` });
    } else {
      res.writeHead(302, { 'Location': `${blockscout}/${hash}` });
    }
  } catch (error) {
    // if there's an error, redirect to blockscout anyways
    res.writeHead(302, { 'Location': `${blockscout}/${hash}` });
  }
  res.end();
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
