'use strict';
/* global define, require, module */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['handlebars', 'jquery'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../handlebars'), require('../jquery')); // Node
    } else {
        factory(window.Handlebars, window.$); // Browser global
    }
}(function (Handlebars) {

    /**
     * Handlebars Helper: Data attributes generator
     * Example:
     *  dataAttributes": {        
     *       "context": {
     *           "type": "typeData",
     *           "value": "valueData"
     *       }
     *   }
     */
    Handlebars.registerHelper('data', function(context) {
        if (context) {
            return ' data-' + context.type + '="' + context.value + '"';
        }
        return '';
    });

    Handlebars.registerHelper('datas', function(context) {
        var output = '';
        for(var attr in context) {
            if (context.hasOwnProperty(attr)) {
                output += ' data-' + context[attr].type + '="' + context[attr].value + '"';
            }
        }
        return output;
    });

    Handlebars.registerHelper('macro', function (name, defaults) {
        Handlebars.registerHelper(name, function (options) {
            var e = $.extend(this, defaults.hash, options.hash);
            return new Handlebars.SafeString(defaults.fn(e));
        });
    });

    Handlebars.registerHelper('nl2br', function(text) {
        var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new Handlebars.SafeString(nl2br);
    });

    /**
     * Log one or multiple values to the console:
     * {{log foo bar}}
     */
    Handlebars.registerHelper('log', function() {
        console.log(['Values:'].concat(
            Array.prototype.slice.call(arguments, 0, -1)
        ));
    });

    /**
     * Log one or multiple values to the console, with the current context:
     * {{debug foo bar}}
     */
    Handlebars.registerHelper('debug', function() {
        console.log('Context:', this);
        console.log(['Values:'].concat(
            Array.prototype.slice.call(arguments, 0, -1)
        ));
    });

    /**     
     * A small collection of useful helpers for Handlebars.js.
     * https://github.com/danharper/Handlebars-Helpers
     */
    var isArray = function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    var ExpressionRegistry = function() {
        this.expressions = [];
    };

    ExpressionRegistry.prototype.add = function (operator, method) {
        this.expressions[operator] = method;
    };

    ExpressionRegistry.prototype.call = function (operator, left, right) {
        if ( ! this.expressions.hasOwnProperty(operator)) {
            throw new Error('Unknown operator "'+operator+'"');
        }

        return this.expressions[operator](left, right);
    };

    var eR = new ExpressionRegistry;
    
    eR.add('not', function(left, right) {
        return left != right;
    });
    eR.add('>', function(left, right) {
        return left > right;
    });
    eR.add('<', function(left, right) {
        return left < right;
    });
    eR.add('>=', function(left, right) {
        return left >= right;
    });
    eR.add('<=', function(left, right) {
        return left <= right;
    });
    eR.add('===', function(left, right) {
        return left === right;
    });
    eR.add('!==', function(left, right) {
        return left !== right;
    });
    eR.add('in', function(left, right) {
        if ( ! isArray(right)) {
            right = right.split(',');
        }
        return right.indexOf(left) !== -1;
    });

    var isHelper = function() {
        var args = arguments
        ,   left = args[0]
        ,   operator = args[1]
        ,   right = args[2]
        ,   options = args[3]
        ;

        if (args.length == 2) {
            options = args[1];
            if (left) return options.fn(this);
            return options.inverse(this);
        }

        if (args.length == 3) {
            right = args[1];
            options = args[2];
            if (left == right) return options.fn(this);
            return options.inverse(this);
        }

        if (eR.call(operator, left, right)) {
            return options.fn(this);
        }
        return options.inverse(this);
    };

    Handlebars.registerHelper('is', isHelper);

}));
