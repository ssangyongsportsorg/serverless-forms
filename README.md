## Improved Version of Serverless Forms

This is an enhanced version based on [lexoyo's serverless-forms](https://github.com/lexoyo/serverless-forms/), offering users a more flexible and powerful serverless form solution.

### Key Additions

1. **Post-submission Redirect**: Allows redirection to custom web pages like thank you pages or order confirmation pages after form submission. (Requires manual modification of index.js)

2. **Customer Reply Functionality**: Adds the customer's email address as a "reply-to" address in the sent email, facilitating customer interaction.

3. **Multi-recipient Support**: Now capable of sending form content to multiple specified email addresses simultaneously.

4. **Spam Detection and Filtering**: Effectively detects and prevents spam using keyword filtering, option filtering, and honeypot mechanisms.

5. **Thank You Page Redirection**: Automatically redirects to a specified thank you page after successful form submission. (Requires manual modification of index.js)

6. **Referrer Checking**: Only allows form submissions from specified websites, enhancing system security. (Requires manual modification of index.js)

## Configuration [Copied from the Original Project](https://github.com/lexoyo/serverless-forms/)

You can configure some additional features through environment variables. Detailed descriptions of the environment variables are as follows:

| Environment Variable | Description |
|---|---|
| MESSAGE | Message displayed after form submission. May contain HTML. Default: 'Thank you for your submission.' |
| TO | Email address to which the form will be sent (your email) |
| FROM | Email address used as the sender's address |
| SITE_NAME | The name of your site, displayed in the email subject |
| PORT | Port to listen for form submissions |
| FORM | Path to the HTML file containing the sample form, default is ./form.html |
| EMAIL_HOST | SMTP configuration: [See options here](https://nodemailer.com/smtp/) |
| EMAIL_PORT | SMTP configuration: [See options here](https://nodemailer.com/smtp/) |
| EMAIL_USER | SMTP configuration: [See options here](https://nodemailer.com/smtp/) |
| EMAIL_PASS | SMTP configuration: [See options here](https://nodemailer.com/smtp/) |

For the additional features we've added, you'll need to modify the code yourself. You can directly edit the index.js file for customization. Due to ~~being lazy~~, we didn't directly incorporate these features into the environment variable configuration.

## Reporting Issues

Contact: dev@ssangyongsports.eu.org or submit problems in the issues section.

With these powerful new features, the improved version not only retains the simplicity and ease of use of the original, but also enhances customization, security, and user experience, better meeting the needs of practical application scenarios. Feel free to reach out with any other questions or requests at any time.



## 改進版無伺服器表單 Serverless Forms

這是一個在[lexoyo的serverless-forms](https://github.com/lexoyo/serverless-forms/)基礎上進行改進和增強的版本,為使用者提供了更加靈活和強大的無伺服器表單解決方案。

### 主要新增功能

1. **表單提交後跳轉**: 允許在表單提交後將頁面重新導向到自訂網站頁面,如感謝頁面或訂單確認頁面等。(需自行修改index.js)

2. **客戶回覆功能**: 會在發送的電子郵件中添加客戶的電子郵件地址作為「回覆」地址,方便與客戶互動。

3. **多人收件**: 現在可以將表單內容同時發送到多個指定的電子郵件地址。

4. **垃圾郵件檢測與過濾**: 使用關鍵字過濾、選項過濾和蜜罐機制來有效檢測和防止垃圾郵件。

5. **感謝頁面重新導向**: 表單提交成功後將自動重新導向到指定的感謝頁面。(需自行修改index.js)

6. **來源檢查**: 只允許來自指定網站的表單提交,提高了系統安全性。(需自行修改index.js)

## 配置 [由原先專案複製來的](https://github.com/lexoyo/serverless-forms/)

您可以透過設定環境變數來配置部分新增功能,詳細的環境變數說明如下:

| 環境變量 | 描述 |
|---|---|
| MESSAGE | 表單提交後顯示的消息。可能包含HTML。默認值：'感謝您的提交。' |
| TO | 將表單發送到的電子郵件地址（您的電子郵件） |
| FROM | 作為寄件人地址使用的電子郵件地址 |
| SITE_NAME | 您站點的名稱，將顯示在電子郵件標題中 |
| PORT | 監聽表單提交的端口 |
| FORM | 包含示例表單的HTML文件的路徑，默認為./form.html |
| EMAIL_HOST | SMTP配置：[在此處查看這些選項](https://nodemailer.com/smtp/) |
| EMAIL_PORT | SMTP配置：[在此處查看這些選項](https://nodemailer.com/smtp/) |
| EMAIL_USER | SMTP配置：[在此處查看這些選項](https://nodemailer.com/smtp/) |
| EMAIL_PASS | SMTP配置：[在此處查看這些選項](https://nodemailer.com/smtp/) |

我們新增的部分功能，你需要自行修改程式碼,您可以直接編輯index.js檔案進行客製化。由於~~太懶~~,我們並沒有直接將這些功能加入到環境變數配置中。
## 回報錯誤
聯繫：dev@ssangyongsports.eu.org或在issues中提交問題

透過這些新增強大的功能,改進版不僅保留了原版的簡單易用,同時增強了客製化、安全性和使用者體驗,可以更好地滿足實際應用場景的需求。如果您有任何其他問題或需求,歡迎隨時反饋。
