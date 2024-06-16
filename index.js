'use strict';

const http = require('http');
const fs = require('fs');
const formidable = require("formidable");
const util = require('util');
const nodemailer = require('nodemailer');
const AkismetClient = require('akismet-api');

// Initialize Akismet client
const akismetClient = new AkismetClient({
  key: process.env.AKISMET_API_KEY,
  blog: 'https://ssangyongsports.eu.org'
});

// Define blocked options
const blockedOptions = ['？']; 
const optionsRegex = new RegExp(blockedOptions.join('|'), 'i');

// Setup the server
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

// Serve HTML file
function displayForm(res) {
  fs.readFile(process.env.FORM || 'form.html', function (err, data) {
    if (err) {
      console.error('Error reading form file:', err);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Length': data.length
    });
    res.write(data);
    res.end();
  });
}

// Get the POST data and call the sendMail method
function processFormFieldsIndividual(req, res) {
  const referer = req.headers.referer || '';
  const clientIP = req.socket.remoteAddress;

  if (referer.startsWith('https://ssangyongsports.eu.org')) {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
      if (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
        return;
      }

      // Check honeypot field
      if (fields['honeypot']) {
        console.log('Spam detected by honeypot!');
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Ha ha, we caught you! Please stop sending this spam contact.');
        return;
      }

      // Check for blocked options
      if (optionsRegex.test(fields['_email.from'])) {
        console.log('Blocked option detected!');
        res.writeHead(403, {
          'Content-Type': 'text/html; charset=utf-8'
        });
        res.write(renderSpamBlockedPage());
        res.end();
        return;
      }

      // Use Akismet to check for spam
      const isSpam = await akismetClient.checkSpam({
        user_ip: clientIP,
        user_agent: req.headers['user-agent'],
        referrer: referer,
        comment_type: 'contact-form',
        comment_author: fields['Email'],
        comment_author_email: fields['Email'],
        comment_content: `${fields['Subject']}\n${fields['message']}`
      });

      if (isSpam) {
        console.log('Spam detected by Akismet!');
        res.writeHead(403, {
          'Content-Type': 'text/html; charset=utf-8'
        });
        res.write(renderSpamBlockedPage());
        res.end();
        return;
      }

      const replyTo = fields['Email'];
      const subject = fields['Subject'];
      const message = fields['message'];
      sendMail(util.inspect(fields), replyTo, subject, message);

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

function sendMail(fields, replyTo, subject, message) {
  const mailOptions = {
    from: process.env.FROM || 'Email form data bot <no-reply@no-email.com>',
    to: [process.env.TO, process.env.TO2],
    replyTo: replyTo,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <h2 style="color: #333333;">${subject}</h2>
        <p style="color: #666666;">訊息內容:</p>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
          <pre style="white-space: pre-wrap; word-wrap: break-word;">${message}</pre>
        </div>
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

function renderSpamBlockedPage() {
  return `<!DOCTYPE html>
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
     <h1>不好意思，請先解決這些問題再聯繫我們。</h1>
    <p>我們知道你肯定不是機器人，但是我們最近經常收到機器人連續垃圾聯繫攻擊，請先刪除以下被我們設為黑名單的文字：「Hi, I’m writing about your price」
「Aloha, write about your the price」
「Hi, I write about the price for reseller」
「幹你娘」（不雅用語）
「Hello I wrote about your price for reseller」
「prices」
「price」</p><p>更多信息：<a href="https://ssangyongsports.eu.org/blog/ban" target="_blank">https://ssangyongsports.eu.org/blog/ban</a></p>
  </div>
</body>
</html>`;
}
