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

        .monospaced {
            font-family: 'Openhuninn', monospace;
        }
    </style>
<script src="chrome-extension://bpoadfkcbjbfhfodiogcnhhhpibjhbnh/image/inject.js" id="imt-image-inject"></script><style data-id="immersive-translate-input-injected-css">.immersive-translate-input {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 2147483647;
  display: flex;
  justify-content: center;
  align-items: center;
}
.immersive-translate-attach-loading::after {
  content: " ";

  --loading-color: #f78fb6;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: block;
  margin: 12px auto;
  position: relative;
  color: white;
  left: -100px;
  box-sizing: border-box;
  animation: immersiveTranslateShadowRolling 1.5s linear infinite;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-2000%, -50%);
  z-index: 100;
}

.immersive-translate-loading-spinner {
  vertical-align: middle !important;
  width: 10px !important;
  height: 10px !important;
  display: inline-block !important;
  margin: 0 4px !important;
  border: 2px rgba(221, 244, 255, 0.6) solid !important;
  border-top: 2px rgba(0, 0, 0, 0.375) solid !important;
  border-left: 2px rgba(0, 0, 0, 0.375) solid !important;
  border-radius: 50% !important;
  padding: 0 !important;
  -webkit-animation: immersive-translate-loading-animation 0.6s infinite linear !important;
  animation: immersive-translate-loading-animation 0.6s infinite linear !important;
}

@-webkit-keyframes immersive-translate-loading-animation {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(359deg);
  }
}

@keyframes immersive-translate-loading-animation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}


.immersive-translate-input-loading {
  --loading-color: #f78fb6;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: block;
  margin: 12px auto;
  position: relative;
  color: white;
  left: -100px;
  box-sizing: border-box;
  animation: immersiveTranslateShadowRolling 1.5s linear infinite;
}

@keyframes immersiveTranslateShadowRolling {
  0% {
    box-shadow: 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }

  12% {
    box-shadow: 100px 0 var(--loading-color), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }

  25% {
    box-shadow: 110px 0 var(--loading-color), 100px 0 var(--loading-color), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }

  36% {
    box-shadow: 120px 0 var(--loading-color), 110px 0 var(--loading-color), 100px 0 var(--loading-color), 0px 0 rgba(255, 255, 255, 0);
  }

  50% {
    box-shadow: 130px 0 var(--loading-color), 120px 0 var(--loading-color), 110px 0 var(--loading-color), 100px 0 var(--loading-color);
  }

  62% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 130px 0 var(--loading-color), 120px 0 var(--loading-color), 110px 0 var(--loading-color);
  }

  75% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 var(--loading-color), 120px 0 var(--loading-color);
  }

  87% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 var(--loading-color);
  }

  100% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0);
  }
}


.immersive-translate-search-recomend {
  border: 1px solid #dadce0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
  font-size: 16px;
}

.immersive-translate-search-enhancement-en-title {
  color: #4d5156;
}

/* dark */
@media (prefers-color-scheme: dark) {
  .immersive-translate-search-recomend {
    border: 1px solid #3c4043;
  }

  .immersive-translate-close-action svg {
    fill: #bdc1c6;
  }

  .immersive-translate-search-enhancement-en-title {
    color: #bdc1c6;
  }
}


.immersive-translate-search-settings {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
}

.immersive-translate-search-recomend::before {
  /* content: " "; */
  /* width: 20px; */
  /* height: 20px; */
  /* top: 16px; */
  /* position: absolute; */
  /* background: center / contain url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAxlBMVEUAAADpTInqTIjpSofnSIfqS4nfS4XqS4nqTIjsTYnrTInqTIroS4jvQIDqTIn////+/v7rSYjpTIn8/v7uaZzrTIr9/f3wfansWJL88/b85e73qc39+/v3xNnylrvrVI/98fb62Obva5/8+fr76vH4y9zpSIj74e353Oj1ocTzm77xhK/veKbtYpjsXJTqU47oTInxjrXyh7L99fj40eH2ttH1udD3sc31ssz1rMnykLXucqPtbqD85e/1xdn2u9DzqcXrUY6FaJb8AAAADnRSTlMA34BgIM8Q37/fz7+/EGOHcVQAAAGhSURBVDjLhZPncuowEEZFTW7bXVU7xsYYTO/p7bb3f6lICIOYJOT4h7/VnFmvrBFjrF3/CR/SajBHswafctG0Qg3O8O0Xa8BZ6uw7eLjqr30SofCDVSkemMinfL1ecy20r5ygR5zz3ArcAqJExPTPKhDENEmS30Q9+yo4lEQkqVTiIEAHCT10xWERRdH0Bq0aCOPZNDV3s0xaYce1lHEoDHU8wEh3qRJypNcTAeKUIjgKMeGLDoRCLVLTVf+Ownj8Kk6H9HM6QXPgYjQSB0F00EJEu10ILQrs/QeP77BSSr0MzLOyuJJQbnUoOOIUI/A8EeJk9E4YUHUWiRyTVKGgQUB8/3e/NpdGlfI+FMQyWsCBWyz4A/ZyHXyiiz0Ne5aGZssoxRmcChw8/EFKQ5JwwkUo3FRT5yXS7q+Y/rHDZmFktzpGMvO+5QofA4FPpEmGw+EWRCFvnaof7Zhe8NuYSLR0xErKLThUSs8gnODh87ssy6438yzbLzxl012HS19vfCf3CNhnbWOL1eEsDda+gDPUvri8tSZzNFrwIZf1NmNvqC1I/t8j7nYAAAAASUVORK5CYII='); */
}

.immersive-translate-search-title {}

.immersive-translate-search-title-wrapper {}

.immersive-translate-search-time {
  font-size: 12px;
  margin: 4px 0 24px;
  color: #70757a;
}

.immersive-translate-expand-items {
  display: none;
}

.immersive-translate-search-more {
  margin-top: 16px;
  font-size: 14px;
}

.immersive-translate-modal {
  display: none;
  position: fixed;
  z-index: 2147483647;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  font-size: 15px;
}

.immersive-translate-modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 40px 24px 24px;
  border: 1px solid #888;
  border-radius: 10px;
  width: 80%;
  max-width: 270px;
  font-family: system-ui, -apple-system, "Segoe UI", "Roboto", "Ubuntu",
    "Cantarell", "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  position: relative
}

.immersive-translate-modal .immersive-translate-modal-content-in-input {
  max-width: 500px;
}
.immersive-translate-modal-content-in-input .immersive-translate-modal-body {
  text-align: left;
  max-height: unset;
}

.immersive-translate-modal-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #333333;
}

.immersive-translate-modal-body {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  word-break: break-all;
  margin-top: 24px;
}

@media screen and (max-width: 768px) {
  .immersive-translate-modal-body {
    max-height: 250px;
    overflow-y: auto;
  }
}

.immersive-translate-close {
  color: #666666;
  position: absolute;
  right: 16px;
  top: 16px;
  font-size: 20px;
  font-weight: bold;
}

.immersive-translate-close:hover,
.immersive-translate-close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.immersive-translate-modal-footer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24px;
}

.immersive-translate-btn {
  width: fit-content;
  color: #fff;
  background-color: #ea4c89;
  border: none;
  font-size: 16px;
  margin: 0 8px;
  padding: 9px 30px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.immersive-translate-btn:hover {
  background-color: #f082ac;
}

.immersive-translate-cancel-btn {
  /* gray color */
  background-color: rgb(89, 107, 120);
}


.immersive-translate-cancel-btn:hover {
  background-color: hsl(205, 20%, 32%);
}

.immersive-translate-action-btn {
  background-color: transparent;
  color: #EA4C89;
  border: 1px solid #EA4C89
}

.immersive-translate-btn svg {
  margin-right: 5px;
}

.immersive-translate-link {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  text-decoration: none;
  color: #007bff;
  -webkit-tap-highlight-color: rgba(0, 0, 0, .1);
}

.immersive-translate-primary-link {
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  text-decoration: none;
  color: #ea4c89;
  -webkit-tap-highlight-color: rgba(0, 0, 0, .1);
}

.immersive-translate-modal input[type="radio"] {
  margin: 0 6px;
  cursor: pointer;
}

.immersive-translate-modal label {
  cursor: pointer;
}

.immersive-translate-close-action {
  position: absolute;
  top: 2px;
  right: 0px;
  cursor: pointer;
}</style></head>
<body>
<header class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600"><nav class="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8" aria-label="Global"><div class="flex lg:flex-1"><a class="-m-1.5 p-1.5" onclick="history.back()"><span class="sr-only">雙龍體育</span><img class="h-8 w-auto" src="https://ssangyongsports.eu.org/logo.png" alt=""></a></div><div class="flex lg:hidden"></div><div class="hidden lg:flex lg:gap-x-8"></div><div style="position:fixed;top:1px;left:1px;width:1px;height:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;display:none"></div><div class="hidden lg:flex lg:flex-1 lg:justify-end"></div></nav><div style="position:fixed;top:1px;left:1px;width:1px;height:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;display:none"></div></header>
<main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900"><div class="flex justify-between px-4 mx-auto max-w-screen-xl "><article class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert"><header class="mb-4 lg:mb-6 not-format"><h1 class="mb-10 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">               

</h1><h1 class="mb-4 text-5xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-5xl dark:text-white">文字中包含了黑名單中的詞語。







</h1> <p>我們知道您不是機器人，但最近我們收到超過1000封包含特定文字的垃圾訊息。因此，我們懇請您避開以下短語，謝謝您的合作！</p>
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
        <p>為了避免這些垃圾訊息對我們的客服和系統造成干擾，我們將實施新的政策。感谢您的理解和配合！</p><p></p><button onclick="history.back()" type="button" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">回上一頁</button><p>這是由雙龍體育技術團隊開發的聯繫系統,任何技術問題請聯繫tech@ssangyongsports.eu.org
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
            ⚠️ ssangyongsportsteam@gmail.com 僅用於通知系統
          </p>
          <p style="margin-top: 10px;">
            技術支持: tech@ssangyongsports.eu.org
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