@echo off
setlocal

REM 1️⃣ 刪除舊的編譯檔
echo Deleting dist...
rd /s /q dist

REM 2️⃣ 編譯 TypeScript
echo Building TypeScript...
call npm run build 2>&1
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

REM 3️⃣ 打包 Lambda
echo Packing Lambda...
REM 使用 7z -r 遞迴壓縮 dist 下所有檔案及 node_modules
7z a -tzip dist\function.zip ./dist/* .env ./node_modules -r

if errorlevel 1 (
    echo Zip failed!
    exit /b 1
)

REM 4️⃣ 更新 Lambda code
echo Updating Lambda function...
call awslocal lambda update-function-code ^
    --function-name localstack-lambda-url-example ^
    --zip-file fileb://%CD%\dist\function.zip

if errorlevel 1 (
    echo Lambda update failed!
    exit /b 1
)

REM 5️⃣ 更新 Lambda 環境變數
echo Updating Lambda environment variables...

REM 注意：這裡的 --environment 參數會覆蓋掉原本的環境變數設定
call aws --endpoint-url=http://localhost:4566 lambda update-function-configuration ^
    --function-name localstack-lambda-url-example^
    --region us-east-1 ^
    --environment Variables={DB_HOST=host.docker.internal,DB_USER=root,DB_PASSWORD=root123456,DB_NAME=demo}

if errorlevel 1 (
    echo Lambda environment update failed!
    exit /b 1
)

echo Done.
endlocal
