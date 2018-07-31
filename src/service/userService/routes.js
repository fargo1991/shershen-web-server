/**
 * Created by yaroslav on 31.07.18.
 */
module.exports = {

    init : function(app, seq, strategics){

        app.get('/user', function(req, res){
            console.log('get user')

        });

        app.post('/user', function(req, res){
            console.log(req.body)
            console.log('_________________________')

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