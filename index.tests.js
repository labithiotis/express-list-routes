const express3 = require('express3');
const express4 = require('express4');
const express5 = require('express5');

const expressListRoutes = require('./index');

jest.spyOn(global.console, 'info');

function handler(req, res) {
  res.send('handled');
}

describe('express 3', () => {
  it('prints out all routes', () => {
    const app = express3();

    app.get('/test', handler);
    app.post('/user', handler);
    app.get('/user', handler);

    expressListRoutes(app);

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/test'],
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
    ]);
  });

  it('works with prefix and dividers', () => {
    const app = express3();

    app.get('/test', handler);
    app.post('/user', handler);
    app.get('/user', handler);

    expressListRoutes(app, { prefix: '/api/v1' });

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/test'],
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/user'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/api/v1/user'],
    ]);
  });
});

describe('express 4', () => {
  it('works with top level routes', () => {
    const app = express4();
    app.get('/user', handler);
    app.post('/user', handler);

    expressListRoutes(app);

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
    ]);
  });

  it('works with express.Router', () => {
    const app = express4();
    const router = express4.Router();

    app.get('/test', handler);

    router.route('/user').post(handler).get(handler).put(handler);

    app.use(router);

    expressListRoutes(router);

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[34mPUT\u001b[39m', '    ', '/user'],
    ]);
  });

  it('handles nested routers', () => {
    const app = express4();
    const router = express4.Router();

    app.get('/test', handler);

    router.route('/user').post(handler).get(handler).put(handler);

    app.use('/admin', router);

    expressListRoutes(app, { prefix: '/api/v1' });

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/test'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/api/v1/admin/user'],
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/admin/user'],
      ['\u001b[34mPUT\u001b[39m', '    ', '/api/v1/admin/user'],
    ]);
  });

  it('works with  options', () => {
    const app = express4();
    app.get('/user', handler);
    app.post('/user', handler);

    expressListRoutes(app, { prefix: '/api/v1', spacer: 3 });

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '', '/api/v1/user'],
      ['\u001b[33mPOST\u001b[39m', '', '/api/v1/user'],
    ]);
  });
});

describe('express 5', () => {
  it('works with top level routes', () => {
    const app = express5();
    app.get('/user', handler);
    app.post('/user', handler);

    expressListRoutes(app);

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
    ]);
  });

  it('works with express.Router', () => {
    const app = express5();
    const router = express5.Router();

    app.get('/test', handler);

    router.route('/user').post(handler).get(handler).put(handler);

    app.use(router);

    expressListRoutes(router);

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[34mPUT\u001b[39m', '    ', '/user'],
    ]);
  });

  it('handles nested routers', () => {
    const app = express5();
    const router = express5.Router();

    app.get('/test', handler);

    router.route('/user').post(handler).get(handler).put(handler);

    app.use('/admin', router);

    expressListRoutes(app, { prefix: '/api/v1' });

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/test'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/api/v1/admin/user'],
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/admin/user'],
      ['\u001b[34mPUT\u001b[39m', '    ', '/api/v1/admin/user'],
    ]);
  });

  it('works with options', () => {
    const app = express5();
    app.get('/user', handler);
    app.post('/user', handler);

    expressListRoutes(app, { prefix: '/api/v1', spacer: 3 });

    expect(global.console.info.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '', '/api/v1/user'],
      ['\u001b[33mPOST\u001b[39m', '', '/api/v1/user'],
    ]);
  });
});
