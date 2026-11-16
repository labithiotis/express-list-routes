const path = require('path');

const defaultOptions = {
  prefix: '',
  spacer: 7,
  logger: console.info,
  color: true,
  forceUnixPathStyle: false,
  pathFallback: '/~',
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

// Walks a regex source and swaps each capturing group for its express param
// name (`:id`) or `*` for unnamed groups. Used for Express 4 routers mounted
// on parameterised paths, e.g. app.use('/users/:id', router).
function replaceCaptureGroups(source, keys) {
  let out = '';
  let keyIndex = 0;
  let i = 0;

  const skipClass = (j) => {
    j++;
    while (j < source.length && source[j] !== ']') j += source[j] === '\\' ? 2 : 1;
    return j + 1;
  };

  while (i < source.length) {
    const char = source[i];
    if (char === '\\') {
      out += source.slice(i, i + 2);
      i += 2;
    } else if (char === '[') {
      const end = skipClass(i);
      out += source.slice(i, end);
      i = end;
    } else if (char === '(' && source[i + 1] !== '?') {
      let depth = 1;
      let j = i + 1;
      while (j < source.length && depth > 0) {
        if (source[j] === '\\') {
          j += 2;
        } else if (source[j] === '[') {
          j = skipClass(j);
        } else {
          if (source[j] === '(') depth++;
          else if (source[j] === ')') depth--;
          j++;
        }
      }
      const key = keys[keyIndex++];
      out += key && typeof key.name === 'string' ? `:${key.name}` : '*';
      i = j;
    } else {
      out += char;
      i++;
    }
  }

  // (?:\/:id) -> /:id, (?:\/:id)? -> /:id?, (?::id) -> :id
  return out.replace(/\(\?:(\\?\/)?(:\w+|\*)\)(\?)?/g, (_, slash, name, optional) => {
    return `${slash ? '/' : ''}${name}${optional || ''}`;
  });
}

function getPathFromRegex(regexp, keys) {
  const source = keys?.length ? `/${replaceCaptureGroups(regexp.source, keys)}/i` : regexp.toString();
  return source
    .replace('/^', '')
    .replace('?(?=\\/|$)/i', '')
    .replace('\\?(?=\\\\|$)', '') // Remove \?(?=\\|$) pattern as string
    .replace(/\\\//g, '/')
    .replace('(?:/(?=$))', '')
    .replace(/\/i$/, ''); // Remove trailing /i flag
}

function combineExpress4Stacks(acc, stack) {
  if (stack.handle?.stack && stack.regexp) {
    const routerPath = getPathFromRegex(stack.regexp, stack.keys);
    return [...acc, ...stack.handle.stack.map((nestedStack) => ({ routerPath, ...nestedStack }))];
  }
  return [...acc, stack];
}

function combineExpress5Stacks(acc, stack, opts) {
  if (stack.handle?.stack) {
    // FIXME express5 we can't get the router path for nested
    // The stack object has not reference to parent router path
    // Tried looking through whole express app object and
    // couldn't find any reference for nested routes.
    // For now we just intedcated nested routes with ~
    const routerPath = stack.path ?? opts?.pathFallback ?? '/~';
    return [...acc, ...stack.handle.stack.map((nestedStack) => ({ routerPath, ...nestedStack }))];
  }
  return [...acc, stack];
}

function getStacks(app, opts) {
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
    return app.router.stack.reduce((acc, stack) => combineExpress5Stacks(acc, stack, opts), []);
  }

  return [];
}

module.exports = function expressListRoutes(app, opts) {
  const stacks = getStacks(app, opts);
  const options = { ...defaultOptions, ...opts };
  const paths = [];

  if (stacks) {
    for (const stack of stacks) {
      if (stack.route) {
        // app.get(['/a', '/b'], fn) stores route.path as an array
        const routePaths = Array.isArray(stack.route.path) ? stack.route.path : [stack.route.path];
        for (const routePath of routePaths) {
          const routeLogged = {};
          for (const route of stack.route.stack) {
            const method = route.method ? route.method.toUpperCase() : null;
            if (!routeLogged[method] && method) {
              const stackMethod = options.color ? colorMethod(method) : method;
              const stackSpace = spacer(options.spacer - method.length);
              let stackPath = path
                .normalize([options.prefix, stack.routerPath, routePath, route.path].filter((s) => !!s).join(''))
                .trim();
              if (options.forceUnixPathStyle) {
                stackPath = stackPath.replace(/\\/g, '/');
              }
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
  }

  return paths;
};
