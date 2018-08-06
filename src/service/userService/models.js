/**
 * Created by yaroslav on 31.07.18.
 */
var Sequelize = require("sequelize");

module.exports =
    {
        init : function(seq){

            var User = seq.define('user',{
                id : {
                    autoIncrement : true,
                    primaryKey : true,
                    type : Sequelize.INTEGER,
                },
                login : {
                    type : Sequelize.STRING,
                    notEmpty : true
                },
                role : {
                  type : Sequelize.STRING,
                  notEmpty : true
                },
                password : {
                    type : Sequelize.STRING,
                    notEmpty : true
                }
            });

          User.hasOne( seq.models.token )

            return [ User ]
        }
    }
