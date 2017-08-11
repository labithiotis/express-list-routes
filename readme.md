# express-list-routes

  List all routes used in Express.

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

```js
const express = require('express');
const expressListRoutes = require('express-list-routes');

const app = express();
const router = new express.Router();
const fn = res => {
  res.send({
      ok: 'ok'
  });
};

router.route('/user').post(fn).get(fn).put(fn);

app.use('/api/v1', router);

expressListRoutes({
    title: 'API'
    prefix: '/api/v1',
    router
}, routesList => {
    console.log(routesList);
})
```

That will log the following response to the console.

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

You can pass these options to the main method.

**Options Object**
```js
{
    title: '', // Only shown when 'string' is passed to return field
    prefix: '', // The prefix for router Path
    spacer: 7 // Spacer between router Method and Path
    router, // Express Router object
    return: 'string' // Defaults to 'string' but can also accept 'array'
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
