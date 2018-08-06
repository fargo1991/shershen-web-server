/**
 * Created by yaroslav on 31.07.18.
 */
const { check, validationResult } = require('express-validator/check');


module.exports = {

    init : function(app, seq, strategics){

        app.get('/user', [
                    check('access_token').exists()
            ],
            function(req, res){

                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    return res.status(422).json({ errors : errors.array() });
                }

            try {
                strategics.get(req.query.access_token,
                    {
                        success: function (params) {

                            if (params.status) res.setHeader('status', params.status)
                            else res.setHeader('status', 200);

                            res.send(params)
                        },
                        error: function (params) {
                            console.log(params)
                            if (params.status) res.setHeader('status', params.status)
                            else res.setHeader('status', 500);

                            res.send(params)
                        }
                    }
                )
            } catch (ex) {
                res.setHeader('status', 500);
                console.log(ex);
                res.send(ex.toString());
            }

        });

        app.post('/user',[
                check('login').isLength({ min : 2, max : 100 }),
                check('password').isLength({ min : 5}),
                check('role').isIn( require('../../accessControl').map( role => role.role ))
            ],
            function(req, res){

                console.log(require('../../accessControl').map( role => role.role ))

                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    console.log('Validation Error POST /user');
                    console.log(errors.array());
                    return res.status(422).json({ errors : errors.array() });
                }

                try {
                    strategics.create(req.body, {
                        success: function (params) {
                            res.send(params)
                        },
                        error: function (params) {
                            res.send(params)
                        }
                    })
                } catch (ex){
                    res.setHeader('status', 500);
                    console.log(ex);
                    res.send(ex.toString());
                }
        });

    }

}