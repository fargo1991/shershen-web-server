/**
 * Created by yaroslav on 03.08.18.
 */

module.exports = {
    init : function(app, seq, strategics){

        app.post('/merchant', function(req, res){

            strategics.create( req.body,
                {
                    success : function(){
                        res.status(200);
                        res.send('ok')
                    },
                    error : function () {
                        res.status(500);
                        res.send('fail')
                    }
                }
            )

        })

    }
}