'use strict';

const http = require('http');
const fs = require('fs');
const formidable = require("formidable");
const util = require('util');
const nodemailer = require('nodemailer');

// setup the server
const server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() === 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() === 'post') {
        processFormFieldsIndividual(req, res);
    }
});

const port = process.env.PORT || 8080;
server.listen(port);
console.log("server listening on ", port);

// serve HTML file
function displayForm(res) {
    fs.readFile(process.env.FORM || 'form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

// get the POST data and call the sendMail method
function processFormFieldsIndividual(req, res) {
    const referer = req.headers.referer || '';
    if (referer.startsWith('https://ssangyongsports.eu.org')) {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields) {
            if (err) {
                console.error(err);
            } else {
                // Check if honeypot field is filled
                if (fields['honeypot']) {
                    console.log('Spam detected!');
                    res.writeHead(403, { 'Content-Type': 'text/plain' });
                    res.end('Sorry, your submission was detected as spam.');
                    return;
                }

                const replyTo = fields['Email'];
                const subject = fields['Subject'];
                sendMail(util.inspect(fields), replyTo, subject);
            }
            res.writeHead(302, {
                'Location': 'https://ssangyongsports.eu.org/thanks'
            });
            res.end();
        });
    } else {
        res.writeHead(403, {
            'Content-Type': 'text/plain'
        });
        res.write('You can only use ssangyongsports.eu.org/contact to contact us; you cannot use other websites.');
        res.end();
    }
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function sendMail(text, replyTo, subject) {
    const mailOptions = {
        from: process.env.FROM || 'Email form data bot <no-reply@no-email.com>',
        to: [process.env.TO, process.env.TO2],
        replyTo: replyTo,
        subject: subject,
        text: text
    };
    console.log('sending email:', mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}