# express-list-routes

  List all routes used in Express[3,4,5]

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

**Example App**
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
**List all Routes with prefix**
```js
expressListRoutes(app, { prefix: '/api/v1' });
// Logs out the following:
// GET    /api/v1/health
// POST   /api/v1/admin/user
// GET    /api/v1/admin/user
// PUT    /api/v1/admin/user
```
**Or only log out nested router routes**
```js
expressListRoutes(router);
// Logs out the following:
// POST   /admin/user
// GET    /admin/user
// PUT    /admin/user
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
    logger: console.info // A custom logger function
    color: true // If the console log should color the method name
  }
```

## Migrations 
### 0.1 -> 1.0
The order of the params have changed, and dropped support for freeform text.

**BEFORE 0.1<**

```expressListRoutes({ prefix: '/api/v1' }, 'API:', router);```

**AFTER 1.0+**

```expressListRoutes(router, { prefix: '/api/v1' });```

[npm-image]: https://img.shields.io/npm/v/express-list-routes.svg?style=flat
[npm-url]: https://npmjs.org/package/express-list-routes
[downloads-image]: https://img.shields.io/npm/dm/express-list-routes.svg?style=flat
[downloads-url]: https://npmjs.org/package/express-list-routes
[travis-image]: https://img.shields.io/travis/strongloop/express-list-routes.svg?style=flat
[travis-url]: https://travis-ci.org/strongloop/express-list-routes
[coveralls-image]: https://img.shields.io/coveralls/strongloop/express-list-routes.svg?style=flat
[coveralls-url]: https://coveralls.io/r/strongloop/express-list-routes?branch=master
