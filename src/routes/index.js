/**
 * Created by yaroslav on 27.08.18.
 */
var app = global.APP;

var customerRoutes = require('./customer')

module.exports = {
    init : function(){

        customerRoutes();

    }
}