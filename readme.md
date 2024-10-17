# express-list-routes

  List all routes used in Express[3,4,5]

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

#### Example App
```js
const express = require('express');
const expressListRoutes = require('express-list-routes');

const app = express();

app.get('/health', fn)

app.use('/admin', router);
router.route('/user')
  .post(fn)
  .get(fn)
  .put(fn);
```

#### List all Routes with prefix
```js
expressListRoutes(app, { prefix: '/api/v1' });
// Logs out the following:
// GET    /api/v1/health
// POST   /api/v1/admin/user
// GET    /api/v1/admin/user
// PUT    /api/v1/admin/user
```

#### Or only log out nested router routes
```js
expressListRoutes(router);
// Logs out the following:
// POST   /admin/user
// GET    /admin/user
// PUT    /admin/user
```

#### Use combined paths to pragmatically do something
`expressListRoutes` returns array of all routes found in express.

```js
const paths = expressListRoutes(req.app, { logger: false });
paths.forEach((endpoint) => {
  if (endpoint.path.endsWith('/')) {
    ...
  }
});
```

## Installation

```bash
npm install express-list-routes
```

## Options

You can pass a second argument to set some options

```js
  {
    prefix: '', // A prefix for router Path
    spacer: 7   // Spacer between router Method and Path
    logger: console.info // A custom logger function or a boolean (true for default logger, false for no logging)
    color: true // If the console log should color the method name
  }
```

## FAQ

<details open>
<summary>Errors with importing this library</summary>
You may need to enable esModuleInterop in your tsconfig.json to support default exports.
</details>

For Express5 currently nested routes will all be printted out as `~` as theres no way to get parent router path from app object that I'm aware of.

[npm-image]: https://img.shields.io/npm/v/express-list-routes.svg?style=flat
[npm-url]: https://npmjs.org/package/express-list-routes
[downloads-image]: https://img.shields.io/npm/dm/express-list-routes.svg?style=flat
[downloads-url]: https://npmjs.org/package/express-list-routes
[travis-image]: https://img.shields.io/travis/strongloop/express-list-routes.svg?style=flat
[travis-url]: https://travis-ci.org/strongloop/express-list-routes
[coveralls-image]: https://img.shields.io/coveralls/strongloop/express-list-routes.svg?style=flat
[coveralls-url]: https://coveralls.io/r/strongloop/express-list-routes?branch=master
