/**
 * Created by yaroslav on 27.08.18.
 */
var user = require('./user');
var token = require('./token');

module.exports = {
    init : function(){
        let UserModel = user(),
            TokenModel = token();

        UserModel.hasOne(TokenModel);
    }
}