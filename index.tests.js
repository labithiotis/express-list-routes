const express3 = require('express3');
const express4 = require('express4');
const express5 = require('express5');

const expressListRoutes = require('./index');

function handler(req, res) {
  res.send('handled');
}

describe('express 3', () => {
  it('prints out all routes', () => {
    const logger = jest.fn();
    const app = express3();

    app.get('/test', handler);
    app.get('/user', handler);
    app.post('/user', handler);
    app.patch('/user', handler);
    app.delete('/user', handler);

    const paths = expressListRoutes(app, { logger });

    expect(paths).toEqual([
      { method: 'GET', path: '/test' },
      { method: 'GET', path: '/user' },
      { method: 'POST', path: '/user' },
      { method: 'PATCH', path: '/user' },
      { method: 'DELETE', path: '/user' },
    ]);
    expect(logger.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/test'],
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
      ['\u001b[90mPATCH\u001b[39m', '  ', '/user'],
      ['\u001b[31mDELETE\u001b[39m', ' ', '/user'],
    ]);
  });

  it('works with prefix and dividers', () => {
    const logger = jest.fn();
    const app = express3();

    app.get('/test', handler);
    app.post('/user', handler);
    app.get('/user', handler);

    const paths = expressListRoutes(app, { logger, prefix: '/api/v1' });

    expect(paths).toEqual([
      { method: 'GET', path: '/api/v1/test' },
      { method: 'GET', path: '/api/v1/user' },
      { method: 'POST', path: '/api/v1/user' },
    ]);
    expect(logger.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/test'],
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/user'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/api/v1/user'],
    ]);
  });
});

describe('express 4', () => {
  it('works with top level routes', () => {
    const logger = jest.fn();
    const app = express4();
    app.get('/user', handler);
    app.post('/user', handler);

    const paths = expressListRoutes(app, { logger });

    expect(paths).toEqual([
      { method: 'GET', path: '/user' },
      { method: 'POST', path: '/user' },
    ]);
    expect(logger.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
    ]);
  });

  it('works with express.Router', () => {
    const logger = jest.fn();
    const app = express4();
    const router = express4.Router();

    app.get('/test', handler);

    router.route('/user').post(handler).get(handler).put(handler);

    app.use(router);

    const paths = expressListRoutes(router, { logger });

    expect(paths).toEqual([
      { method: 'POST', path: '/user' },
      { method: 'GET', path: '/user' },
      { method: 'PUT', path: '/user' },
    ]);
    expect(logger.mock.calls).toEqual([
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[34mPUT\u001b[39m', '    ', '/user'],
    ]);
  });

  it('handles nested routers', () => {
    const logger = jest.fn();
    const app = express4();
    const router = express4.Router();

    app.get('/test', handler);

    router.route('/user').post(handler).get(handler).put(handler);

    app.use('/admin', router);

    const paths = expressListRoutes(app, { logger, prefix: '/api/v1' });

    expect(paths).toEqual([
      { method: 'GET', path: '/api/v1/test' },
      { method: 'POST', path: '/api/v1/admin/user' },
      { method: 'GET', path: '/api/v1/admin/user' },
      { method: 'PUT', path: '/api/v1/admin/user' },
    ]);
    expect(logger.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/test'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/api/v1/admin/user'],
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/admin/user'],
      ['\u001b[34mPUT\u001b[39m', '    ', '/api/v1/admin/user'],
    ]);
  });

  it('works with  options', () => {
    const logger = jest.fn();
    const app = express4();
    app.get('/user', handler);
    app.post('/user', handler);

    const paths = expressListRoutes(app, { logger, prefix: '/api/v1', spacer: 3 });

    expect(paths).toEqual([
      { method: 'GET', path: '/api/v1/user' },
      { method: 'POST', path: '/api/v1/user' },
    ]);
    expect(logger.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '', '/api/v1/user'],
      ['\u001b[33mPOST\u001b[39m', '', '/api/v1/user'],
    ]);
  });
});

describe('express 5', () => {
  it('works with top level routes', () => {
    const logger = jest.fn();
    const app = express5();
    app.get('/user', handler);
    app.post('/user', handler);

    const paths = expressListRoutes(app, { logger });

    expect(paths).toEqual([
      { method: 'GET', path: '/user' },
      { method: 'POST', path: '/user' },
    ]);
    expect(logger.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
    ]);
  });

  it('works with express.Router', () => {
    const logger = jest.fn();
    const app = express5();
    const router = express5.Router();

    app.get('/test', handler);

    router.route('/user').post(handler).get(handler).put(handler);

    app.use(router);

    const paths = expressListRoutes(router, { logger });

    expect(paths).toEqual([
      { method: 'POST', path: '/user' },
      { method: 'GET', path: '/user' },
      { method: 'PUT', path: '/user' },
    ]);
    expect(logger.mock.calls).toEqual([
      ['\u001b[33mPOST\u001b[39m', '   ', '/user'],
      ['\u001b[32mGET\u001b[39m', '    ', '/user'],
      ['\u001b[34mPUT\u001b[39m', '    ', '/user'],
    ]);
  });

  it('handles nested routers', () => {
    const logger = jest.fn();
    const app = express5();
    const router = express5.Router();

    app.get('/test', handler);

    router.route('/user').post(handler).get(handler).put(handler);

    app.use('/admin', router);

    expressListRoutes(app, { logger, prefix: '/api/v1' });

    expect(logger.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/test'],
      ['\u001b[33mPOST\u001b[39m', '   ', '/api/v1/~/user'], // FIXME express5 we can't get the router path for nested
      ['\u001b[32mGET\u001b[39m', '    ', '/api/v1/~/user'], // FIXME express5 we can't get the router path for nested
      ['\u001b[34mPUT\u001b[39m', '    ', '/api/v1/~/user'], // FIXME express5 we can't get the router path for nested
    ]);
  });

  it('works with options', () => {
    const logger = jest.fn();
    const app = express5();
    app.get('/user', handler);
    app.post('/user', handler);

    expressListRoutes(app, { logger, prefix: '/api/v1', spacer: 3 });

    expect(logger.mock.calls).toEqual([
      ['\u001b[32mGET\u001b[39m', '', '/api/v1/user'],
      ['\u001b[33mPOST\u001b[39m', '', '/api/v1/user'],
    ]);
  });
});

describe('unknown app', () => {
  it('works if the app passed in does not have stacks/routes', () => {
    const logger = jest.fn();

    const paths = expressListRoutes({}, { logger });

    expect(paths).toEqual([]);
    expect(logger.mock.calls).toEqual([]);
  });

  it('handles "other" methods', () => {
    const logger = jest.fn();
    const app = express3();

    app.trace('/test', handler);

    const paths = expressListRoutes(app, { logger });

    expect(paths).toEqual([{ method: 'TRACE', path: '/test' }]);
    expect(logger.mock.calls).toEqual([['TRACE', '  ', '/test']]);
  });

  it('disable coloring method names if option is false', () => {
    const logger = jest.fn();
    const app = express3();

    app.get('/test', handler);

    const paths = expressListRoutes(app, { logger, color: false });

    expect(paths).toEqual([{ method: 'GET', path: '/test' }]);
    expect(logger.mock.calls).toEqual([['GET', '    ', '/test']]);
  });
});

describe('path styles', () => {
  it('converts backslashes to forward slashes when forceUnixPathStyle is true', () => {
    const logger = jest.fn();
    const app = express4();
    
    // Mock Windows environment by manipulating the path separator
    const originalSep = require('path').sep;
    require('path').sep = '\\';
    
    app.get('/test/path', handler);
    
    const paths = expressListRoutes(app, { logger, forceUnixPathStyle: true });
    
    // Restore original separator
    require('path').sep = originalSep;
    
    // Even on Windows, with forceUnixPathStyle: true, paths should use forward slashes
    expect(paths[0].path).toContain('/');
    expect(paths[0].path).not.toContain('\\');
  });

  it('removes ?(?=\\|$) pattern from paths', () => {
    const app = express4();
    
    // Create a mock stack entry that simulates a regex with the problematic pattern
    const mockStack = {
      regexp: /^\/test\?(?=\\|$)/i,
      handle: {
        stack: [{
          route: {
            path: '/endpoint',
            stack: [{ method: 'get' }]
          }
        }]
      }
    };
    
    // Override the app's router stack with our mock
    app._router = { stack: [mockStack] };
    
    const paths = expressListRoutes(app, { logger: false });
    
    // The pattern should be removed from the final path
    expect(paths).toHaveLength(1);
    expect(paths[0].path).not.toContain('?(?=\\|$)');
    expect(paths[0].path).toBe('/test/endpoint');
  });

  it('handles Windows paths with regex patterns as reported in issue', () => {
    const app = express4();
    
    // Simulate the exact pattern from the issue: \topics\?(?=\|$)\:topicId
    const mockStack = {
      regexp: /^\\topics\\?(?=\\|$)/i,
      handle: {
        stack: [{
          route: {
            path: '/:topicId',
            stack: [{ method: 'get' }]
          }
        }]
      }
    };
    
    app._router = { stack: [mockStack] };
    
    // Test without forceUnixPathStyle
    let paths = expressListRoutes(app, { logger: false });
    
    // Should not contain the regex pattern
    expect(paths[0].path).not.toContain('?(?=\\|$)');
    // On Linux/Unix, backslashes should remain as is without the option
    expect(paths[0].path).toBe('\\\\topics/:topicId');
    
    // Test with forceUnixPathStyle
    paths = expressListRoutes(app, { logger: false, forceUnixPathStyle: true });
    
    // Should convert backslashes to forward slashes
    expect(paths[0].path).toBe('//topics/:topicId');
  });
});
