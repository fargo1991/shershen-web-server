/**
 * Created by yaroslav on 27.08.18.
 */

var signIn = require('./signin.js');
var signUp = require('./signup.js');

module.exports = function(){

    signIn();
    signUp();

}