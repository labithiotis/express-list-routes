const defaultOptions = {
  prefix: '',
  spacer: 7,
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
    return app._router.stack.reduce((acc, stack) => {
      if (stack.handle.stack) {
        return [...acc, ...stack.handle.stack];
      }
      return [...acc, stack];
    }, []);
  }

  // Express 4 Router
  if (app.stack) {
    return app.stack.reduce((acc, stack) => {
      if (stack.handle.stack) {
        return [...acc, ...stack.handle.stack];
      }
      return [...acc, stack];
    }, []);
  }

  // Express 5
  if (app.router && app.router.stack) {
    return app.router.stack.reduce((acc, stack) => {
      if (stack.handle.stack) {
        return [...acc, ...stack.handle.stack];
      }
      return [...acc, stack];
    }, []);
  }

  return [];
}

module.exports = function expressListRoutes(app, opts) {
  const stacks = getStacks(app);
  const options = { ...defaultOptions, ...opts };

  if (stacks) {
    for (const stack of stacks) {
      if (stack.route) {
        const routeLogged = {};
        for (const route of stack.route.stack) {
          const method = route.method ? route.method.toUpperCase() : null;
          if (!routeLogged[method] && method) {
            console.info(
              colorMethod(method),
              spacer(options.spacer - method.length),
              [options.prefix, stack.route.path, route.path].filter((s) => !!s).join(''),
            );
            routeLogged[method] = true;
          }
        }
      }
    }
  }
};
