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
                    notEmpty : true,
                    unique : true
                },
                role : {
                  type : Sequelize.STRING,
                  notEmpty : true
                },
                password : {
                    type : Sequelize.STRING,
                    notEmpty : true
                },
                phone : {
                    type : Sequelize.STRING,
                    unique : true
                },
              /**
               * зона smsSERVICE
               * @phoneConfirmed имеет несколько состояний:
               * - не подтвержден && пользоветель не отправил запрос на подтверждение : 0
               * - запрос на подтверждение отправлен : "@confirmationCode"."@UnixTime" (jwt)
               *     @confirmationCode - код отправленный по смс юзеру
               *     @confirmationSendDate - время отправки кода авторизации по смс. По истечении @phoneConfirmationTimeLimit требуется обновление sms-кода
               * - подтвержден : 1
               * */
                phoneConfirmed : {
                    type : Sequelize.STRING,
                    notEmpty : true
                },

            });

          User.hasOne( seq.models.token )

            return [ User ]
        }
    }
