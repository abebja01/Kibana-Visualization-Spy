var elasticMapping = require('./src/elasticMapping/createElasticMap');

var date = new Date(Date.now());
var month = date.getMonth() + 1;
var year = date.getFullYear();


module.exports = {



    mongoConfig: {
    	username: "username",
    	password: "password",
    	ip: 'mongodb://localhost',
        dbName: 'dbname',
        visStateCollection: "<Collection where to save visualizations>",
        replicaSetName: null
    },

 

    elasticConfig: {
        host: 'host-domain for elastic',
        port: 9200,
        auth: 'username:pass (of kibana)',
        errLogIndex: "<name for index where to log errors if any in Elastic Search>"
    },

    transporterConfig: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        authOptional: true,
        auth: {
            user: '<senderMail>',
            pass: '<password>'
        }
    },

    mailConfig: {
        from: '"Kibana Visualization Change" <email>', // sender address
        to: '<email>,<email>', // list of receivers
        subject: 'There is a visualization change', // Subject line
        text: '', // plain text body
        //html: '<b>Hello world ?</b>' // html body
    },
}
