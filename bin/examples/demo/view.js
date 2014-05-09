/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 2014/05/09
 * Time: 00:42
 *
 */

define(function (require, exports, module) {
    'use strict';
    var $ = require("$");
    var template = require("demoPath/template.handlebars");
    module.exports = {
        setCss: function() {
            $("body").css({
                "color": "#ff3300"
            });
        },
        append: function() {
            $("body:first").append(template({name: "WuLiang"}));
        }
    };
});
