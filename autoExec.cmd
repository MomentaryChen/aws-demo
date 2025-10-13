@echo off
setlocal

REM 1️⃣ 刪除舊的結果
if exist result (
    echo Deleting result...
    rd /s /q result
)

REM 2️⃣ 建立新的結果資料夾
echo Creating result...
mkdir result

REM 4️⃣ 執行 Lambda 並取得 log
echo Invoking Lambda...
call awslocal lambda invoke --function-name localstack-lambda-url-example ^
--log-type Tail ^
--query "LogResult" ^
--output text > result\log.b64 ^
--payload "{\"body\": {\"num1\": \"10\", \"num2\": \"10\"}}" result\output.json

REM 5️⃣ 解碼 log.b64
if exist result\log.b64 (
    echo Decoding log.b64...
    certutil -decode result\log.b64 result\log.txt > nul
    echo Log decoded to log.txt
)

REM 6️⃣ get all full events
mkdir result\log
awslocal logs filter-log-events ^
--log-group-name /aws/lambda/localstack-lambda-url-example ^
--limit 100 > result/log/full-events-log.json

echo Done.
endlocal
