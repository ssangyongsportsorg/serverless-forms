'use strict';

const http = require('http');
const fs = require('fs');
const formidable = require("formidable");
const util = require('util');
const nodemailer = require('nodemailer');
const querystring = require('querystring');

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
async function processFormFieldsIndividual(req, res) {
  const referer = req.headers.referer || '';
  const clientIP = req.socket.remoteAddress; // 获取客户端 IP 地址
  const userAgent = req.headers['user-agent'];

  if (referer.startsWith('https://ssangyongsports.eu.org')) {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
      if (err) {
        console.error(err);
      } else {
        // Check if honeypot field is filled
        if (fields['honeypot']) {
          console.log('Spam detected!');
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('Ha ha, we caught you! Please stop sending this spam contact.');
          return;
        }

        // Check with Akismet
        const isSpam = await checkAkismet({
          clientIP,
          userAgent,
          referrer,
          message: fields['Message'],
          otherFields: fields
        });

        if (isSpam) {
          console.log('Spam detected by Akismet!');
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('Ha ha, we caught you! Please stop sending this spam contact.');
          return;
        }

        const replyTo = fields['Email'];
        const subject = fields['Subject'];
        sendMail(util.inspect(fields), replyTo, subject, clientIP); // 传递客户端 IP 地址
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

function sendMail(text, replyTo, subject, clientIP) {
  const mailOptions = {
    from: process.env.FROM || 'Email form data bot <no-reply@no-email.com>',
    to: [process.env.TO, process.env.TO2],
    replyTo: replyTo,
    subject: subject,
    text: `${text}\n\nClient IP: ${clientIP}` // 在邮件正文中显示客户端 IP 地址
  };

  console.log('sending email:', mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

async function checkAkismet(data) {
  const akismetData = {
    blog: 'https://ssangyongsports.eu.org',
    user_ip: data.clientIP,
    user_agent: data.userAgent,
    referrer: data.referrer,
    permalink: 'https://ssangyongsports.eu.org/contact',
    comment_type: 'contact-form',
    comment_content: data.message,
    ...data.otherFields
  };

  const dataString = querystring.stringify(akismetData);

  const options = {
    hostname: 'rest.akismet.com',
    port: 80,
    path: '/1.1/comment-check',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': dataString.length
    },
    auth: 'process.env.Key'
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data === 'true');
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(dataString);
    req.end();
  });
}