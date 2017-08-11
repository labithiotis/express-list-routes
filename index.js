const path = require('path');
const colors = require('colors/safe');

const options = {
    prefix: '',
    spacer: 7
};

const colorMethod = method => {
    switch (method) {
        case ('POST'): return colors.yellow(method);
        case ('GET'): return colors.green(method);
        case ('PUT'): return colors.blue(method);
        case ('DELETE'): return colors.red(method);
        case ('PATCH'): return colors.grey(method);
        default: return method;
    }
};

const listRoutes = (opts = {}, callback) => {
    const promise = new Promise((resolve, reject) => {
        const {prefix, router} = opts;
        const routes = [];

        if (!('stack' in router)) {
            reject(new Error('router is missing stack field.'));
        }

        router.stack.forEach(stack => {
            if (stack.route) {
                stack.route.stack.forEach(routePath => {
                    const method = routePath.method ? routePath.method.toUpperCase() : null;

                    if (method) {
                        routes.push({
                            method,
                            path: path.join('/', prefix, stack.route.path)
                        });
                    }
                });
            }
        });

        if (opts.return === 'string' || !opts.return) {
            const newRoutes = routes.map(route => {
                const spacer = Array(options.spacer - route.method.length).join(' ');
                return colorMethod(route.method) + spacer + route.path;
            });
            const title = colors.magenta(opts.title);
            resolve(title + '\n' + newRoutes.join('\n'));
        } else {
            resolve(routes);
        }
    });

    if (callback && typeof callback === 'function') {
        promise.then(callback);
    }

    return promise;
};

module.exports = listRoutes;
