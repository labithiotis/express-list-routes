const path = require('path');

const defaultOptions = {
  prefix: '',
  spacer: 7,
  logger: console.info,
  color: true,
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
  return regexp
    .toString()
    .replace('/^', '')
    .replace('?(?=\\/|$)/i', '')
    .replace(/\\\//g, '/')
    .replace('(?:/(?=$))', '');
}

function combineExpress4Stacks(acc, stack) {
  if (stack.handle?.stack && stack.regexp) {
    const routerPath = getPathFromRegex(stack.regexp);
    return [...acc, ...stack.handle.stack.map((nestedStack) => ({ routerPath, ...nestedStack }))];
  }
  return [...acc, stack];
}

function combineExpress5Stacks(acc, stack) {
  if (stack.handle?.stack) {
    // FIXME express5 we can't get the router path for nested
    // The stack object has not reference to parent router path
    // Tried looking through whole express app object and
    // couldn't find any reference for nested routes.
    // For now we just intedcated nested routes with ~
    const routerPath = stack.path ?? '/~';
    return [...acc, ...stack.handle.stack.map((nestedStack) => ({ routerPath, ...nestedStack }))];
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
    return app._router.stack.reduce(combineExpress4Stacks, []);
  }

  // Express 4 Router
  if (app.stack) {
    return app.stack.reduce(combineExpress4Stacks, []);
  }

  // Express 5
  if (app.router && app.router.stack) {
    return app.router.stack.reduce(combineExpress5Stacks, []);
  }

  return [];
}

module.exports = function expressListRoutes(app, opts) {
  const stacks = getStacks(app);
  const options = { ...defaultOptions, ...opts };
  const paths = [];

  if (stacks) {
    for (const stack of stacks) {
      if (stack.route) {
        const routeLogged = {};
        for (const route of stack.route.stack) {
          const method = route.method ? route.method.toUpperCase() : null;
          if (!routeLogged[method] && method) {
            const stackMethod = options.color ? colorMethod(method) : method;
            const stackSpace = spacer(options.spacer - method.length);
            const stackPath = path
              .normalize([options.prefix, stack.routerPath, stack.route.path, route.path].filter((s) => !!s).join(''))
              .trim();
            if (options.logger === true) {
              defaultOptions.logger(stackMethod, stackSpace, stackPath);
            } else if (typeof options.logger === 'function') {
              options.logger(stackMethod, stackSpace, stackPath);
            }
            paths.push({ method, path: stackPath });
            routeLogged[method] = true;
          }
        }
      }
    }
  }

  return paths;
};
