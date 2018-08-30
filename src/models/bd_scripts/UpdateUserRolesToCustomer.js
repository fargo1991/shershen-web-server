/**
 * Created by yaroslav on 30.08.18.
 */
var { Op } = require("sequelize");

module.exports = function(mode){

  /**
   *
   * Присваивается роль 'CUSTOMER' для всех user, где role не присвоена, т.е. null
   *
   * */

  return (
    global.DB.models.user.update({
      role : 'CUSTOMER'
    }, {
      where : {
        role : {
          [Op.eq] : null
        }
      }
    })
  )
}