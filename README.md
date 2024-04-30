在這個改進版中，我們對原始[專案](https://github.com/lexoyo/serverless-forms/)進行了一些增強功能的添加，使其更加靈活和功能強大。

## 新增功能

1. **提交後跳轉至自定義頁面：** 在原專案的基礎上，我們增加了一個功能，允許使用者在提交表單後將頁面重新導向到他們自己定義的網站頁面。這個功能為使用者提供了更多的定制化選項，使他們能夠根據自己的需求，將表單提交後的流程引導至特定的頁面，例如感謝頁面或訂單確認頁面等。（自行使用須在index.js修改連接噢！）

2. **增加客戶回覆郵件** 我們會依據客戶聯繫中提供的電子郵件，添加到電子郵件中的回覆（relpy to）。
3. **寄送到多個郵件**現在你可以寄送到多個郵件帳號

4. **垃圾郵件偵測和過濾**
   - 使用了一個名為 `spamKeywords` 的陣列來存儲一些常見的垃圾郵件關鍵字
   - 使用了一個名為 `blockedOptions` 的陣列來存儲需要過濾的選項
   - 使用正則表達式來檢測表單數據中是否包含這些關鍵字或選項

5. **蜜罐欄位偵測**
   - 使用了名為 `honeypot` 的欄位作為蜜罐，用於檢測機器人垃圾郵件

6. **重定向到感謝頁面**
   - 如果表單提交成功，則將用戶重定向到 `https://ssangyongsports.eu.org/thanks` 頁面

7. **來源網站檢查**
   - 檢查表單提交的來源網站，只允許 `https://ssangyongsports.eu.org/contact` 提交表單


## 配置 [從專案複製](https://github.com/lexoyo/serverless-forms/)

我們新增的功能你需要在index.js，這是你可以透過部署平台提交的變數

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
## 回報錯誤
聯繫：dev@ssangyongsports.eu.org或在issues中提交問題
通過這些新增的功能，我們希望能夠為使用者提供一個更加全面和強大的無伺服器表單解決方案，滿足他們不同的需求和使用場景。

