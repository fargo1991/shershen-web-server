/**
 * Created by yaroslav on 03.08.18.
 */
var Sequelize = require('sequelize');

module.exports = {
        init : function(seq){

            var Merchant = seq.define('merchant', {
                id : {
                    autoIncrement : true,
                    primaryKey : true,
                    type : Sequelize.INTEGER
                },
                name : {
                    type: Sequelize.STRING
                },
            });

            return [ Merchant ]
        }
    }