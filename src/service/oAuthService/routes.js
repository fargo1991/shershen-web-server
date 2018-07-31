/**
 * Created by yaroslav on 31.07.18.
 */
module.exports = {
    init : function(app, models, strategics){

        app.get('/oauth/token', function(req, res){
            strategics.auth({
                username : req.body.username,
                password : req.body.password
                },
                {
                    success : function(params){ res.send(params) },
                    error : function(params){ res.send(params) }
                }
            )
        });

        app.get('/oauth/token/check', function(req, res){
            strategics.authenticate(
                req.body.access_token,
                {
                    success : function(params){ res.send(params) },
                    error : function(params){ res.send(params) }
                }
            )
        })

    }
}