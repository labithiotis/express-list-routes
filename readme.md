# express-list-routes

  List all routes used in Express.

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

```js
const expressListRoutes = require('express-list-routes');
const express = require('express');

const app = express()

app.use('/api/v1', router);

router.route('/user')
  .post(fn)
  .get(fn)
  .put(fn);
    
expressListRoutes(router, { prefix: '/api/v1' });

```

Will output

```console
POST   /api/v1/user
GET    /api/v1/user
PUT    /api/v1/user
```

## Installation

```bash
$ npm install express-list-routes
```

## Options

You can pass a second argument to set some options

```js
  {
    prefix: '', // A prefix for router Path
    spacer: 7   // Spacer between router Method and Path
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
