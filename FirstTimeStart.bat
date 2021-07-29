@echo off
echo This process will auto-install all the npm modules nessecary for this bot to function, and remove the .gitignore files.
pause
cd ./events/
del /f .gitignore
cd ../pastevents/
del /f .gitignore
cd ../queue/
del /f .gitignore
cd ../notifier/
del /f .gitignore
cd ../
echo Succsessfully removed all .gitignore files.
echo Installing node modules...
npm i
echo Auto fixing modules...
npm audit fix
echo Installed and fixed node modules!
echo Process complete.
cmd /k
