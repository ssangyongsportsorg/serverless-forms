'use strict';

const http = require('http');
const fs = require('fs');
const formidable = require("formidable");
const util = require('util');
const nodemailer = require('nodemailer');

// 定義一個包含垃圾關鍵字的陣列
const spamKeywords = [
  'Hi, i writing about your   price',
  'Aloha,   write about your the price', 
  'Hi, i write about   the price for reseller',
  '幹你娘',
  'Hello  i wrote about your   price for reseller',
  'prices',
  'price',
];

// 定義一個包含需要過濾選項的陣列
const blockedOptions = ['？']; 

// 使用正則表達式建立黑名單模式
const spamRegex = new RegExp(spamKeywords.join('|'), 'i');
const optionsRegex = new RegExp(blockedOptions.join('|'), 'i');

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
  const clientIP = req.socket.remoteAddress;

  if (referer.startsWith('https://ssangyongsports.eu.org')) {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
      if (err) {
        console.error(err);
      } else {
        // 檢查蜜罐欄位
        if (fields['honeypot']) {
          console.log('Spam detected!');
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('Ha ha, we caught you! Please stop sending this spam contact.');
          return;
        }

        // 檢查主旨和內容是否包含垃圾關鍵字
        if (spamRegex.test(fields['Subject']) || spamRegex.test(fields['message']) || optionsRegex.test(fields['_email.from'])) {
          console.log('Spam or blocked option detected!');
          res.writeHead(403, {
            'Content-Type': 'text/html; charset=utf-8'
          });
          // 呈現HTML畫面
          res.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文字黑名單-雙龍體育</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }

    .error-container {
      background-color: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      text-align: center;
      max-width: 500px;
    }

    h1 {
      color: #dc3545;
      margin-bottom: 20px;
    }

    p {
      color: #6c757d;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="error-container">
     <h1>禁止垃圾訊息</h1>
    <p>抱歉，您的消息似乎包含垃圾郵件內容或已被封鎖的選項，因此已被封鎖。更多信息：<a href="https://ssangyongsports.eu.org/blog/ban" target="_blank">https://ssangyongsports.eu.org/blog/ban</a></p>
  </div>
</body>
</html>`);
          res.end();
          return;
        }

        const replyTo = fields['Email'];
        const subject = fields['Subject'];
        sendMail(util.inspect(fields), replyTo, subject, clientIP);
      }

      res.writeHead(302, {
        'Location': 'https://ssangyongsports.eu.org/thanks'
      });
      res.end();
    });
  } else {
    res.writeHead(403, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('您只能使用 ssangyongsports.eu.org/contact 與我們聯繫,不能使用其他網站。');
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

function sendMail(fields, replyTo, subject, clientIP) {
  const mailOptions = {
    from: process.env.FROM || 'Email form data bot <no-reply@no-email.com>',
    to: [process.env.TO, process.env.TO2],
    replyTo: replyTo,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <h2 style="color: #333333;">${fields.hasOwnProperty('subject') ? fields['subject'] : ''}</h2>
        <p style="color: #666666;">訊息內容:</p>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
   ${message}
        </div>
        <p style="color: #666666; margin-top: 20px;">客戶端 IP: ${clientIP}</p>
      </div>
    `
  };

  console.log('sending email:', mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}