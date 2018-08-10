/**
 * Created by yaroslav on 31.07.18.
 */


module.exports = {
    "DB": {
      // jino
      "development": {
        "database": "fargo-1991_shershen",
        "host": "postgresql.fargo-1991.myjino.ru",
        "username": "fargo-1991_shershen",
        "password": "15mlk89ser",
        "dialect": "postgresql"
      },
      // "development" : {
      //     "username" : "postgres",
      //     "password" : "123",
      //     "host" : "127.0.0.1",
      //     // "host" : "192.168.2.66", // home msc
      //     "database" : "sher-shen",
      // },
      "test": {
        "username": "",
        "password": null,
        "host": "",
        "database": "",
        "dialect": "postgresql"
      },
      "production": {
        "username": "",
        "password": null,
        "host": "",
        "database": "",
        "dialect": "postgresql"
      },
    },
    "ROUTES_ACCESS" : [
      { route : '/user', methods : [ 'GET', 'PUT', 'DELETE' ] },
      { route : '/merchant', methods : [ 'PUT', 'DELETE', 'POST' ] }
    ],
    "ACCESS_CONTROL" : require('./accessControl.js'),
    "PHONE_CONFIRMATION_TIME_LIMIT" : 300, // 5 min
    "HOST_URL" : 3456
}
