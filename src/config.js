/**
 * Created by yaroslav on 31.07.18.
 */
module.exports = {
    "development" : {
        "username" : "postgres",
        "password" : "123",
        // "host" : "127.0.0.1",
        "host" : "192.168.2.66", // home msc
        "database" : "sher-shen",
        // "database" : "shershen",
        "dialect" : "postgresql"
    },
    "test" : {
        "username" : "",
        "password" : null,
        "host" : "",
        "database" : "",
        "dialect" : "postgresql"
    },
    "production" : {
        "username" : "",
        "password" : null,
        "host" : "",
        "database" : "",
        "dialect" : "postgresql"
    }
}
