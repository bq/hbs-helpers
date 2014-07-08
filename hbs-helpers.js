'use strict';
/* global define, require, module */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['handlebars'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../handlebars')); // Node
    } else {
        factory(window.Handlebars); // Browser global
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
        context.forEach(function(value) {
            output += ' data-' + value.type + '="' + value.value + '"';
        });
        return output;
    });

}));
