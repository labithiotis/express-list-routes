# express-list-routes

  List all routes used in Express.

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

```js
var expressListRoutes   = require('express-list-routes'),
    express             = require('express'),
    router              = express.Router();

app.use('/api/v1', router);

router.route('/user')
  .post(fn)
  .get(fn)
  .put(fn);
    
expressListRoutes({ prefix: '/api/v1' }, 'API:', router );

```

Will output

```console
API:
POST   /api/v1/user
GET    /api/v1/user
PUT    /api/v1/user
```

## Installation

```bash
$ npm install express-list-routes --save
```

## Options

You can pass any three aguments of either a `String` `Express Router` or `Options`

**Options Object**
```js
  {
    prefix: '', // The prefix for router Path
    spacer: 7   // Spacer between router Method and Path
  }
```


[npm-image]: https://img.shields.io/npm/v/express-list-routes.svg?style=flat
[npm-url]: https://npmjs.org/package/express-list-routes
[downloads-image]: https://img.shields.io/npm/dm/express-list-routes.svg?style=flat
[downloads-url]: https://npmjs.org/package/express-list-routes
[travis-image]: https://img.shields.io/travis/strongloop/express-list-routes.svg?style=flat
[travis-url]: https://travis-ci.org/strongloop/express-list-routes
[coveralls-image]: https://img.shields.io/coveralls/strongloop/express-list-routes.svg?style=flat
[coveralls-url]: https://coveralls.io/r/strongloop/express-list-routes?branch=master
