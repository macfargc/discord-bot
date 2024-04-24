@echo off
cls
set /p TOKEN=Enter your Bot Token:
echo token="%TOKEN%">>.env
set /p guildId=Enter your server's id:
echo guildId="%guildId%">>.env
set /p clientId=Enter your bot's id:
echo clientId="%clientId%">>.env
set /p logChannelId=Enter the id for your log channel:
echo logChannelId="%logChannelId%">>.env
npm install discord.js sqlite3 dotenv
npm i pm2
echo Please now run the file named run.bat thank you!
pause
