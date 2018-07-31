/**
 * Created by yaroslav on 31.07.18.
 */
var Sequelize = require("sequelize");

module.exports = {
    init : function (sequilize) {

        var Token = sequilize.define('token', {
            id : {
                autoIncrement : true,
                primaryKey : true,
                type : Sequelize.INTEGER
            },
            token : {
                unique : true,
                type : Sequelize.STRING
            }
        }
        );

        return [ Token ]

    },
}