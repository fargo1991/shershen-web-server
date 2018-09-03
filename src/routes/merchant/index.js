/**
 * Created by yaroslav on 30.08.18.
 */
var signup = require('./signup');
var merchant = require('./merchant');

module.exports = function(){
  signup();
  merchant();
}