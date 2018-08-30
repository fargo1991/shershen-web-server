/**
 * Created by yaroslav on 27.08.18.
 */
var app = global.APP;

var customerRoutes = require('./customer');
var secureRoutes = require('./secure');
var merchantRoutes = require('./merchant');

module.exports = {
    init : function(){

        secureRoutes();
        customerRoutes();
        merchantRoutes();

    }
}