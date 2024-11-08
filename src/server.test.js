
const http = require('http');
const createServer = require('./server');

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('Server tests', () => {
  let server;
  beforeAll(() => {
    server = createServer();
    return server.listen(3001);
  });

  afterAll(() => {
    return server.close();
  });

  test('redirects to blockscout with invalid hash if no hash is provided', (done) => {
    http.get('http://localhost:3001/i/am/not/valid', (res) => {
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('https://explorer.laosnetwork.io/tx/0x52e30adb4948a99fd9c43c11a076b7c31a2f3151f96476f0590c9cde99755efb');
      done();
    });
  });

  test('redirects to statescan if the transaction exists', (done) => {
    mockFetch.mockResolvedValueOnce({ status: 200 });

    http.get('http://localhost:3001/tx/statescanHash', (res) => {
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('https://laos.statescan.io/#/extrinsics/statescanHash');
      done();
    });
  });

  test('redirects to blockscout if the statescan does have the transaction', (done) => {
    mockFetch.mockResolvedValueOnce({ status: 404 });

    http.get('http://localhost:3001/tx/blockscoutHash', (res) => {
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('https://explorer.laosnetwork.io/tx/blockscoutHash');
      done();
    });
  });

  test('redirects to blockscout if there is an error fetching the transaction', (done) => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    http.get('http://localhost:3001/tx/errorHash', (res) => {
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('https://explorer.laosnetwork.io/tx/errorHash');
      done();
    });
  });
});
