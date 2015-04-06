var _       = require('lodash'),
    colors  = require('colors'),
    options = {
        prefix: '',
        spacer: 7
    };

function spacer(x) {
    var res = '';
    while(x--) res += ' ';
    return res;
}

function colorMethod(method) {
    switch(method){
        case('POST'):   return method.yellow; break;
        case('GET'):    return method.green; break;
        case('PUT'):    return method.blue; break;
        case('DELETE'): return method.red; break;
        case('PATCH'):  return method.grey; break;
        default:        return method;
    }
}

module.exports = function() {
    _.each(arguments, function(arg){
        if (_.isString(arg)) {
            console.info(arg.magenta);
        } else if (_.isObject(arg)) {
            if(!arg.stack) {
                _.assign(options, arg);
            } else {
                _.each(arg.stack, function(stack){
                    if (stack.route) {
                        var route = stack.route,
                            methodsDone= {};
                        _.each(route.stack, function(r){
                          var method = r.method ? r.method.toUpperCase() : null;
                          if(!methodsDone[method] && method){
                                console.info(colorMethod(method), spacer(options.spacer - method.length), options.prefix + route.path);
                                methodsDone[method] = true;
                            }
                        });
                    }
                });
            }
        }
    });
};
