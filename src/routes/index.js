/**
 * Created by yaroslav on 27.08.18.
 */
var app = global.APP;

var customerRoutes = require('./customer');
var secureRoutes = require('./secure');

module.exports = {
    init : function(){

        customerRoutes();
        secureRoutes();

    }
}