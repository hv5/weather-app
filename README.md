# Simple Node.js App

Prerequsites
-------------
1. Create an Azure account
2. Install nodejs v8.12.0 from https://nodejs.org/en/download/
3. Install Visual Studio Code from https://code.visualstudio.com/Download
4. Install Azure CLI from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows

Create simple web app
----------------------
1. Navigate to C:\appl and create a new folder named NodeApps
2. Navigate to C:\appl\NodeApps and create new folder named weather-app
3. Navigate to C:\appl\NodeApps\weather-app
4. Start Visual Studio Code and open folder C:\appl\NodeApps\weather-app
5. From Visual Studio Code, open new Terminal window and run cmd *powershell*
6. From Terminal window, run these commands to setup your project:
	- *npm init*
	- *npm install request*
7. Open File Explorer and navigate to ...
8. Drag file index.js into Visual Studio Code explorer window
9. Drag file web.config into Visual Studio Code explorer window
10. From Terminal window, run *node index.js* to start local web server
11. Open a web browser and navigate to http://localhost:3000/


Put the project into a ZIP file
--------------------------------
1. From Termina window. run *Compress-Archive -Path * -DestinationPath ../weather-app.zip -Force*


Portal: Update your Web App service with a proper Node version
---------------------------------------------------------------
1. Login to https://portal.azure.com
2. Navigate to your Web App service (username-app)
3. For your Web App service, select Application settings
4. Add new setting **WEBSITE_NODE_DEFAULT_VERSION : 8.9.4** and save

CLI: Update your Web App service with a proper Node version 
------------------------------------------------------------
1. az login
2. az webapp config appsettings set --resource-group Lurahammaren --name evje-app --setting WEBSITE_NODE_DEFAULT_VERSION=8.9.4


Portal: Deploy the zipped project to the Azure web app service 
---------------------------------------------------------------
1. Navigate to your Web App service (username-app where username is your own user id)
2. From the Overview page, copy the URL (https://username-app.azurewebsites.net)
3. Open the URL above in the web browser (https://username-app.azurewebsites.net)
4. Navigate to the SCM for your App service(https://username-app.scm.azurewebsites.net)
5. Navigate to Tools > Zip Push Deployment
6. Drag the file C:\appl\NodeApps\weather-app.zip into the ZipDeploy tool in SCM

CLI: Deploy the zipped project to the Azure web app service
------------------------------------------------------------
1. az login
2. az webapp deployment source config-zip --resource-group Lurahammaren --name evje-app --src ../weather-app.zip


Navigate to your Web App URL (https://username-app.azurewebsites.net)






















