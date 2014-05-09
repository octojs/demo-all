/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 2014/05/09
 * Time: 00:41
 *
 */

define(function (require, exports, module) {
    'use strict';
    var $ = require("$");
    var view = require("demoPath/view");
    setTimeout(function() {
        view.setCss();
        view.append();
    }, 1000);
});
