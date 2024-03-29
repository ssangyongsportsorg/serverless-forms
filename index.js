'use strict';
var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var nodemailer = require('nodemailer');

// IP 限制設置
const ipLimiter = new Map();
const maxRequests = 3; // 允許最大請求次數
const timeRange = 60 * 60 * 1000; // 1 小時的毫秒數

// setup the server
// listen on port specified by the `PORT` env var
var server = http.createServer(function (req, res) {
  if (req.method.toLowerCase() === 'get') {
    displayForm(res);
  } else if (req.method.toLowerCase() === 'post') {
    processFormFieldsIndividual(req, res);
  }
});
var port = process.env.PORT || 8080;
server.listen(port);
console.log("server listening on ", port);

// serve HTML file
// located according to the `FORM` env var
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

// get the POST data 
// and call the sendMail method
function processFormFieldsIndividual(req, res) {
  var referer = req.headers.referer || '';
  if (referer.startsWith('https://ssangyongsports.eu.org')) {
    const ip = req.socket.remoteAddress; // 獲取客戶端 IP
    const currentTime = Date.now(); // 當前時間戳記

    // 檢查該 IP 是否超出限制
    const lastVisit = ipLimiter.get(ip) || { count: 0, time: 0 };
    const { count, time } = lastVisit;

    if (currentTime - time < timeRange && count >= maxRequests) {
      res.writeHead(429, { 'Content-Type': 'text/plain' });
      res.end('The Ssangyong sports team only agreed to three contacts, one hour each, on one IP.');
      return;
    }

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
      if (err) {
        console.error(err);
      } else {
        // 檢查 honeypot 欄位是否被填寫
        if (fields.honeypot) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('Detected as a bot, request rejected.');
          return;
        }

        var replyTo = fields['Email'];
        var subject = fields['Subject'];
        sendMail(util.inspect(fields), replyTo, subject, ip);
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

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendMail(text, replyTo, subject, ip) {
  let mailOptions = {
    from: process.env.FROM || 'Email form data bot <no-reply@no-email.com>',
    to: [process.env.TO, process.env.TO2],
    replyTo: replyTo,
    subject: subject,
    text: `${text}\n\nClient IP: ${ip}`
  };
  console.log('sending email:', mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}