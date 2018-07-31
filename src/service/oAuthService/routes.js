/**
 * Created by yaroslav on 31.07.18.
 */
module.exports = {
    init : function(app, models, strategics){

        app.post('/oauth/token', function(req, res){

            strategics.auth({
                login : req.body.login,
                password : req.body.password
                },
                {
                    success : function(params){

                        if (params.status) res.setHeader('status', params.status)
                        else res.setHeader( 'status', 200 );

                        res.send(params)
                    },
                    error : function(params){

                        console.log(params)

                      if (params.status) res.setHeader('status', params.status)
                      else res.setHeader( 'status', 500);

                        res.send(params)
                    }
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