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
<html lang="zh-tw"><head><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="utf-8">
<title>文字中包含了黑名單中的詞語。</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
 <style>
        @font-face {
              font-family: 'Openhuninn';
              src: url('https://ssangyongsports.eu.org/fonts/jf-openhuninn-2.0.ttf') format('truetype');
            }

        body {
            font-family: 'Openhuninn', sans-serif;
        }

    </style></head>
<body>
<header class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600"><nav class="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"><main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900"><div class="flex justify-between px-4 mx-auto max-w-screen-xl "><article class="mx-auto w-full max-w-2xl format format-sm sm:format-">
</h1><h1 class="mb-4 text-5xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-5xl dark:text-white">文字中包含了黑名單中的詞語。</h1> <p>我們知道您不是機器人，但最近我們收到超過1000封包含特定文字的垃圾訊息。因此，我們懇請您避開以下短語，謝謝您的合作！</p>
        <div class="list">
            <p>這些訊息通常包含以下短語：</p>
            <ul>
                <li>「Hi, I’m writing about your price」</li>
                <li>「Aloha, write about your the price」</li>
                <li>「Hi, I write about the price for reseller」</li>
                <li>不雅用語</li>
                <li>「Hello I wrote about your price for reseller」</li>
                <li>「prices」</li>
                <li>「price」</li>
            </ul>
        </div>
        <p>為了避免這些垃圾訊息對我們的客服和系統造成干擾，我們將實施新的政策。感谢您的理解和配合！</p><p></p><button onclick="history.back()" type="button">返回</button>
</p>
</header></article>
</div></main>
<footer class="bg-gray-50 dark:bg-gray-800"></footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
<div id="immersive-translate-popup" style="all: initial"></div></body></html>`);
          res.end();
          return;
        }

        const replyTo = fields['Email'];
const name = fields['Name'];
const subject = fields['Subject'];
const message = fields['message'];

sendMail(name, replyTo, subject, message);

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

function sendMail(name, replyTo, subject, message) {
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: [process.env.TO, process.env.TO2],
    replyTo: replyTo,
    subject: subject,
    html: `
      <div style="
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        max-width: 600px;
        margin: 20px auto;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        color: #2c3e50;
        line-height: 1.6;
      ">
        <div style="
          background: #3498db;
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        ">
          <h1 style="margin: 0; font-size: 22px;">🚀 ${subject}</h1>
        </div>

        <div style="
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        ">
          <h2 style="
            color: #3498db;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 15px;
          ">
            訊息內容
          </h2>

          <pre style="
            white-space: pre-wrap; 
            word-wrap: break-word;
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Fira Code', monospace;
          ">${message}</pre>
        </div>

        <div style="
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
          color: #7f8c8d;
        ">
          <p>由 ${name} 透過 ${replyTo} 提交</p>
          <p>🔒 雙龍體育技術團隊安全驗證</p>
          <p style="
            background-color: #ecf0f1;
            padding: 10px;
            border-radius: 6px;
            margin-top: 15px;
          ">
            ⚠️ ssangyongsportsteam@gmail.com 僅用於通知客服系統，你可以忽略
          </p>
          <p style="margin-top: 10px;">
            技術提供: tech@ssangyongsports.eu.org
          </p>
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