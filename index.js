const path = require('path');

const defaultOptions = {
  prefix: '',
  spacer: 7,
  output: '',
};

const COLORS = {
  yellow: 33,
  green: 32,
  blue: 34,
  red: 31,
  grey: 90,
  magenta: 35,
  clear: 39,
};

const spacer = (x) => (x > 0 ? [...new Array(x)].map(() => ' ').join('') : '');

const colorText = (color, string) => `\u001b[${color}m${string}\u001b[${COLORS.clear}m`;

function colorMethod(method) {
  switch (method) {
    case 'POST':
      return colorText(COLORS.yellow, method);
    case 'GET':
      return colorText(COLORS.green, method);
    case 'PUT':
      return colorText(COLORS.blue, method);
    case 'DELETE':
      return colorText(COLORS.red, method);
    case 'PATCH':
      return colorText(COLORS.grey, method);
    default:
      return method;
  }
}

function getPathFromRegex(regexp) {
  return regexp.toString().replace('/^', '').replace('?(?=\\/|$)/i', '').replace(/\\\//g, '/');
}

function combineStacks(acc, stack) {
  if (stack.handle.stack) {
    const routerPath = getPathFromRegex(stack.regexp);
    return [...acc, ...stack.handle.stack.map((stack) => ({ routerPath, ...stack }))];
  }
  return [...acc, stack];
}

function getStacks(app) {
  // Express 3
  if (app.routes) {
    // convert to express 4
    return Object.keys(app.routes)
      .reduce((acc, method) => [...acc, ...app.routes[method]], [])
      .map((route) => ({ route: { stack: [route] } }));
  }

  // Express 4
  if (app._router && app._router.stack) {
    return app._router.stack.reduce(combineStacks, []);
  }

  // Express 4 Router
  if (app.stack) {
    return app.stack.reduce(combineStacks, []);
  }

  // Express 5
  if (app.router && app.router.stack) {
    return app.router.stack.reduce(combineStacks, []);
  }

  return [];
}

/**
 * function returns a JSON object divided in subroutes in subdirectories
 *
 * routerList = {
 *  '/user': [
 *    {method: 'GET', routerPath: '/info', path: "user/info"},
 *    {method: 'POST', routerPath: '/', path: "user/"},
 *    {method: 'PATCH', routerPath: '/:id', path: "user/:id"}
 *   ],
 *  'addresses' : [
 *    {method: 'GET', routerPath: '/overview', path: "addresses/overview"},
 *    {method: 'POST', routerPath: 'customer/', path: "addresses/customer"},
 *    {method: 'PATCH', routerPath: 'customer/:id', path: "addresses/customer/:id"}
 *    ],
 *    .....
 *   }
 *
 * @return { object }
 */
const getRouterList = (stacks) => {
  const routerList = {};
  let routes = [];
  let routerFolder;
  if (stacks) {
    const routerFolderLogged = {};
    for (const stack of stacks) {
      // put the filled routes array to the routerList object before
      // property gets reseted
      if (routes && routes.length !== 0) routerList[routerFolder] = routes;

      routerFolder = stack.routerPath || '/';

      // create or change property of route list and reset the routes array
      // if routerFolder changes
      if (!routerFolderLogged[routerFolder] && routerFolder) {
        routerList[routerFolder] = [];
        routerFolderLogged[routerFolder] = true;
        routes = [];
      }
      if (stack.route) {
        const routeLogged = {};
        for (const route of stack.route.stack) {
          const method = route.method ? route.method.toUpperCase() : null;

          // Unfortunately, in Windows-based systems the drive letters are added
          // to the path. Therefore the complete path is converted by replace.
          const completePath = path
            .resolve([stack.routerPath, stack.route.path, route.path].filter((s) => !!s).join(''))
            .replace(/^[A-Z][\:][\\]+/g, "/") // removes drive letter C:\
            .replace(/\\\\/+g, '/'); // removes double backslashes
          if (!routeLogged[method] && method) {
            routes.push({
              method,
              routerPath: stack.route.path,
              path: completePath,
            });
            routeLogged[method] = true;
          }
        }
      }
    }
    // last stack of stacks
    routerList[routerFolder] = routes;
  }
  return routerList;
};

module.exports = function expressListRoutes(app, opts) {
  const stacks = getStacks(app);
  const options = { ...defaultOptions, ...opts };

  if (stacks && options.output === 'json') return getRouterList(stacks);

  if (stacks) {
    for (const stack of stacks) {
      if (stack.route) {
        const routeLogged = {};
        for (const route of stack.route.stack) {
          const method = route.method ? route.method.toUpperCase() : null;
          if (!routeLogged[method] && method) {
            const stackMethod = colorMethod(method);
            const stackSpace = spacer(options.spacer - method.length);
            const stackPath = path.resolve(
              [options.prefix, stack.routerPath, stack.route.path, route.path].filter((s) => !!s).join(''),
            );
            console.info(stackMethod, stackSpace, stackPath);
            routeLogged[method] = true;
          }
        }
      }
    }
  }
};
