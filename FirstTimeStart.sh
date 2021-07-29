echo This process will auto-install all the npm modules nessecary for this bot to function, and remove the .gitignore files.
read -p "Press enter to continue..." input
echo Deleting .gitignore files...
cd ./events/
rm -f .gitignore
cd ../pastevents/
rm -f .gitignore
cd ../queue/
rm -f .gitignore
cd ../notifier/
rm -f .gitignore
cd ../
echo Succsessfully removed all .gitignore files.
echo Installing node modules...
npm i
echo Auto fixing modules...
npm audit fix
echo Installed and fixed node modules!
echo Process complete.