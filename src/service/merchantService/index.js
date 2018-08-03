/**
 * Created by yaroslav on 03.08.18.
 */
var models = require('./models.js');
var routes = require('./routes.js');

module.exports = function(app,seq){

    models.init(seq);
    routes.init(app, seq,
        {
            create : function(params, callback){
                seq.models.merchant.create(params)
                    .then(
                        (result) => {
                            callback.success({ success : true, msg : `Merchant ${result.dataValues.name} was created.` })
                            console.log('New MERCHANT was created:');
                            console.log(result);
                        },
                        (error) => {
                            callback.error({ success : false, msg : 'Something went wrang' })
                            console.log('Error was occured during MERCHANT creating')
                        }
                    )
            },
            get : function(params, callback){

            }
        }
    )

}