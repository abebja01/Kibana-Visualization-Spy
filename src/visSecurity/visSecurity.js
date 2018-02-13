var elastic = require('../em/elastic');
var mongo = require('../em/mongo');
var async = require('async');
var nodeMailer = require('./nodeMailer/nodeMailer');
var configs = require('../../config');
var fs = require('fs');

async.waterfall(
    [
    	mongo.open,
        checkKibanaVis,
    	mongo.close
    ], function (err) {

    	if (!err) {
    		return console.log('Finished!');
    	}

        var errorLog = {
            "Time": new Date(Date.now()),
            err
        };

        elastic.indexSingleItem(
            errorLog,
            configs.elasticConfig.errLogIndex,
            'visSecurityError',
            function (err) {
                if (!err) { process.exit(); }

                fs.writeFile('../errorlog', errorLog.err, function (error) {
                    if (!error) { process.exit(); }
                    console.log(error);
                });

            }
        );
    }
);

function checkKibanaVis(cb) {

    var ElasticQuery = '*';
    elastic.search('.kibana', 'visualization', ElasticQuery, (err, res) => {
        if (err) return cb(err);

        var visInfo = res.hits.hits;

        async.forEach(visInfo, function (visualizationType, callback) {

            visualizationType._source["ElasticId"] = visualizationType._id;
            visualizationType._source["Date"] = new Date(Date.now());

            mongo.findOne(configs.mongoConfig.visStateCollection, { 'ElasticId': visualizationType._source.ElasticId }, { sort: { "Date": -1 } }, function (err, res) {
            	if (err) return callback(err);

            	if (!res) {
            		mongo.insert(configs.mongoConfig.visStateCollection, [visualizationType._source], function (err, res) {
                        if (!err) { return callback(); };
                        return callback(err);
                    });
            	}

                if ((res.visState === visualizationType._source.visState)) {
                    return callback();
                }

                nodeMailer.setMailContent(

                    `Kibana Visualization ${visualizationType._source.title} has changed !`,
                    `A change was made to Kibana Visualization ${visualizationType._source.title} on ${visualizationType._source.Date}.
                     \r\n Before: 
                     \r\n${res.visState} 

                     \r\n After: 
                     \r\n${visualizationType._source.visState}
                     
                     /r/n See differences here : http://json-diff.com/
                      \r\n\r\n\r\n Ignore if the change was made intentionally`
                );

                nodeMailer.sendMail(function (err) {
                	if (err) return callback(err);

                    mongo.insert(configs.mongoConfig.visStateCollection , [visualizationType._source], function (err, res) {
                        if (!err) { return callback(); }
                        return callback(err);
                    });
                });
            });
        }, function (err) {
            if (!err) { return cb(); }
            return cb(err);
        })
    });
}
