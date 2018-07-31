/**
 * Created by yaroslav on 31.07.18.
 */
module.exports = {

    init : function(app, seq, strategics){

        app.get('/user', function(req, res){

            console.log('______')
            console.log(req.query)

            strategics.get(req.query.access_token,
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

        app.post('/user', function(req, res){

            strategics.create(req.body, {
                success : function(params){
                    res.send(params)
                },
                error : function(params){
                    res.send(params)
                }
            })
        });

    }

}