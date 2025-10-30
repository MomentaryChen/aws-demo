# aws-demo

**Language**: [English](README.md) | 繁體中文

---

一個以 LocalStack 模擬 AWS Lambda 的示範專案，提供兩個主要自動化腳本：

- autoDeploy.cmd：建置、打包並更新 Lambda（含環境變數設定）
- autoExec.cmd：呼叫 Lambda 並收集/解碼執行日誌

透過這兩支腳本，開發者可以在本機快速迭代 Lambda 程式碼與驗證執行結果。

---

## 專案結構

```
aws-demo/
  autoDeploy.cmd          # 打包並更新 Lambda（LocalStack）
  autoExec.cmd            # 呼叫 Lambda 並輸出日誌到 result/
  src/                    # TypeScript 原始碼（handler、db、model）
  dist/                   # 編譯輸出與打包檔（function.zip）
  result/                 # autoExec 產生之輸出與日誌
  event.json              # 範例事件（可自行調整）
  package.json            # NPM scripts 與依賴
  tsconfig.json           # TypeScript 設定
  aws-lambda-log-previewer/ # React 前端日誌檢視器（可選）
```

Lambda 預設名稱：`localstack-lambda-url-example`

CloudWatch Log Group：`/aws/lambda/localstack-lambda-url-example`

---

## 先決條件

- Windows（.cmd 腳本）
- Node.js 18+ 與 npm
- TypeScript（透過專案 `devDependencies` 安裝）
- LocalStack（本機執行）
- AWS CLI 與 awslocal（或等效別名）
- 7-Zip（命令列 `7z`，用於壓縮 `function.zip`）
- certutil（Windows 內建，用於 Base64 解碼日誌）

安裝提示：

- awslocal 可透過 `pip install awscli-local` 或以 `aws --endpoint-url=http://localhost:4566` 方式替代。
- 7-Zip 請確認 `7z` 已加入 PATH。

---

## 快速開始

1. 安裝依賴

```
npm install
```

2. 確認 LocalStack 執行中，並已建立名為 `localstack-lambda-url-example` 的 Lambda。

3. 部署（建置+打包+更新 Lambda）

在專案根目錄雙擊或命令列執行：

```
autoDeploy.cmd
```

成功後 `dist/function.zip` 會被上傳至 LocalStack 中的 Lambda。腳本同時會設定（覆蓋）以下環境變數：

```
DB_HOST=host.docker.internal
DB_USER=root
DB_PASSWORD=root123456
DB_NAME=demo
```

4. 執行 Lambda 並收集日誌

```
autoExec.cmd
```

執行後會產生：

- `result/output.json`：Lambda 的回應 Payload
- `result/log.b64`：Base64 編碼的執行日誌
- `result/log.txt`：已解碼的執行日誌（可直接閱讀）
- `result/log/full-events-log.json`：CloudWatch Logs 匯出的完整事件紀錄（含多筆）

---

## autoDeploy.cmd 說明

主要流程：

1. 刪除舊的 `dist/`
2. 以 `npm run build` 編譯 TypeScript 至 `dist/`
3. 使用 `7z` 將 `dist/*` 與 `node_modules` 打成 `dist/function.zip`
4. `awslocal lambda update-function-code` 更新 Lambda 程式碼
5. `aws --endpoint-url=http://localhost:4566 lambda update-function-configuration` 覆蓋設定環境變數

常見問題：

- 找不到 `7z`：請確認 7-Zip 已安裝並將路徑加入 PATH。
- `awslocal` 指令不存在：改用 `aws --endpoint-url=http://localhost:4566`。
- Build 失敗：先在命令列手動執行 `npm run build` 以查看詳細錯誤。

---

## autoExec.cmd 說明

主要流程：

1. 清空並建立 `result/`
2. 以 `awslocal lambda invoke` 呼叫 `localstack-lambda-url-example`
   - 請求 Payload 範例：
     ```json
     { "body": { "num1": "10", "num2": "10" } }
     ```
   - Lambda 回應存至 `result/output.json`
   - `--log-type Tail` 取得 Base64 日誌（寫入 `result/log.b64`）
3. 使用 `certutil -decode` 將 `log.b64` 轉為 `result/log.txt`
4. 以 `awslocal logs filter-log-events` 匯出完整事件至 `result/log/full-events-log.json`

你可以調整腳本中的 `--payload` 以測試不同輸入。

---

## NPM Scripts（摘要）

請查看根目錄 `package.json` 以取得完整指令；一般來說：

```
npm run build    # 編譯 TypeScript 到 dist/
```

---

## 前端日誌檢視器（可選）

`aws-lambda-log-previewer/` 目錄內含一個基於 React 的日誌檢視器應用程式，提供友善的介面來檢視與過濾 Lambda 執行日誌。

**功能特色：**
- 📊 可排序的可視化日誌表格
- 🔍 日誌事件的 JSON 詳細檢視器
- 🎨 現代化的 Material-UI 介面
- 📤 上傳並預覽 `result/log/full-events-log.json` 檔案

**快速開始：**

1. 進入日誌檢視器目錄：
   ```bash
   cd aws-lambda-log-previewer
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 啟動開發伺服器：
   ```bash
   npm start
   ```

4. 透過網頁介面上傳產生的日誌檔案（`result/log/full-events-log.json`）。

更多詳細資訊，請參閱 [aws-lambda-log-previewer/README.md](aws-lambda-log-previewer/README.md)。

---

## 小技巧

- 若要直接用 `event.json` 測試，可修改 `autoExec.cmd` 的 `--payload`，或在 Lambda 端讀取預設事件。
- 若你在 Docker 裡跑 LocalStack，資料庫位址常使用 `host.docker.internal`（已於環境變數預設）。

---

## 版權與維護

本專案僅作為教學與示範用途。歡迎 PR 與 Issue 提出改善建議。

