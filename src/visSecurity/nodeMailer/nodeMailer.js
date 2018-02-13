'use strict';

var nodemailer = require('nodemailer');
var transporterConfig = require('../../config').transporterConfig;
var mailConfig = require('../../config').mailConfig;

let transporter = nodemailer.createTransport(transporterConfig);

module.exports = {

    setMailContent: function (subject, text) {
        mailConfig.subject = subject,
        mailConfig.text = text
    },
    sendMail: function (cb) {
        transporter.sendMail(mailConfig, (error, info) => {

            if (!error) {
                console.log('Message %s sent: %s', info.messageId, info.response);
                cb();
            }
            
            return cb(error);
        });
    }
}