Prerequsites
-------------
1) Install nodejs v8.12.0 from https://nodejs.org/en/download/
2) Install Visual Studio Code from https://code.visualstudio.com/Download

Create simple Node web app
-----------------------------
1) Navigate to C:\appl and create a new folder named NodeApps
2) Navigate to C:\appl\NodeApps and create new folder named weather-app
3) Navigate to C:\appl\NodeApps\weather-app
4) Start Visual Studio Code and open folder C:\appl\NodeApps\weather-app
5) From Visual Studio Code, open new Terminal window
6) From Terminal window, run "npm init" (accept all defaults)
7) Inspect the package.json file that has been created
8) In the weather-app folder, create an empty file named index.js
9) Copy the following code into index.js:

var http = require('http');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World!");
});

port = process.env.PORT || 3000;
server.listen(port);

console.log("Server running at http://localhost:%d", port);

10) From Terminal window, run "node index.js" to start local web server
11) Open a web browser and navigate to http://localhost:3000/


Add a bit more logic to the application by retrieving and displaying weather forecast from an an open API.
Example URL: 
http://api.openweathermap.org/data/2.5/weather?q=stavanger&units=metric&appid=a2d6d978685ade382f71c7c863b40d2a


12) From Terminal window, run "npm install request" (installs module convenient for making API calls)
13) Rename file index.js to index_v0.js and create a new empty file named index.js
14) Copy the following code into index.js:

var http = require('http');
var request = require('request');
var url = require('url');

var apiKey = 'a2d6d978685ade382f71c7c863b40d2a';

// Server object handling incoming requests
var server = http.createServer(function(req, resp) {
    
    // Retrieve input parameters
    var query = url.parse(req.url, true).query;

    var city = query.city;
    if (city == null)
        city = 'stavanger';

    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?units=metric&q=' + city + '&appid=' + apiKey;
    console.log(apiUrl);

    // Request data through openweather API
    request(apiUrl, function(apiErr, apiRes, apiBody) {
        var data = JSON.parse(apiBody);

        if (data.cod != 200) {
            resp.end("No weather forecast for city " + city);
            return;
        }

        // Response header
        resp.setHeader('Content-Type', 'text/html');

        // Application name, etc
        resp.write('<html>');
        resp.write('<title>AXDM EXPD Tutorial</title>');
        resp.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
        resp.write('<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">');
        resp.write('<body>');

        // City header
        resp.write('<div class="w3-container w3-indigo">');
        resp.write('<p style="margin:8px; font-size:36px">' + data.name + '&nbsp');
        resp.write('<span style="font-size:16px">' + data.sys.country + '</span>');
        resp.write('</p>');
        resp.write('</div>');

        // Temperatur, weather symbol and description
        resp.write('<div class="w3-container w3-blue">');
        resp.write('<p style="font-size:64px; margin:0px">' + Math.round(data.main.temp) + '&#176' + '</p>');
        resp.write('<img src="http://api.openweathermap.org/img/w/' + data.weather[0].icon + '.png' + '">');
        resp.write('<span style="font-size:20px; margin:8px">' + (data.weather[0].description).toUpperCase() + '</span>');
        resp.write('</div>');

        // Other meaures
        resp.write('<div class="w3-container w3-blue">');
        resp.write('<p style="margin-left:8px">');
        resp.write('Wind: ' + data.wind.speed + ' m/s' + '<br>');
        resp.write('Pressure: ' + data.main.pressure + ' mbar' + '<br>');
        resp.write('Humidity: ' + data.main.humidity + ' %' + '<br>');
        resp.write('</p>');
        resp.write('</div>');

        // Host where application runs
        resp.write('<div class="w3-container">');
        resp.write('<p style="font-size:10px; text-align:right">' + 'Run from ' + req.headers.host + '</p>');
        resp.write('</div>');

        resp.write("</body>");
        resp.write("</html>");

        resp.end();
    });   
});

port = process.env.PORT || 3000;
server.listen(port);

console.log("Server running at http://localhost:%d", port);


15) From Terminal window, run "node index.js" to start local web server
16) Open a web browser and navigate to http://localhost:3000/
17) Check for another city: http://localhost:3000?city=rome


Deploy this application to the Azure Web App service we created
----------------------------------------------------------------

18) In the weather-app folder, create an empty file named web.config
19) Copy the following code into web.config:

<?xml version="1.0" encoding="utf-8"?>
<!--
     This configuration file is required if iisnode is used to run node processes behind
     IIS or IIS Express.  For more information, visit:

     https://github.com/tjanczuk/iisnode/blob/master/src/samples/configuration/web.config
-->

<configuration>
  <system.webServer>
    <!-- Visit http://blogs.msdn.com/b/windowsazure/archive/2013/11/14/introduction-to-websockets-on-windows-azure-web-sites.aspx for more information on WebSocket support -->
    <webSocket enabled="false" />
    <handlers>
      <!-- Indicates that the server.js file is a node.js site to be handled by the iisnode module -->
      <add name="iisnode" path="index.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <!-- Do not interfere with requests for node-inspector debugging -->
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^index.js\/debug[\/]?" />
        </rule>

        <!-- First we consider whether the incoming URL matches a physical file in the /public folder -->
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>

        <!-- All other URLs are mapped to the node.js site entry point -->
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="index.js"/>
        </rule>
      </rules>
    </rewrite>
    
    <!-- 'bin' directory has no special meaning in node.js and apps can be placed in it -->
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>

    <!-- Make sure error responses are left untouched -->
    <httpErrors existingResponse="PassThrough" />

    <!--
      You can control how Node is hosted within IIS using the following options:
        * watchedFiles: semi-colon separated list of files that will be watched for changes to restart the server
        * node_env: will be propagated to node as NODE_ENV environment variable
        * debuggingEnabled - controls whether the built-in debugger is enabled

      See https://github.com/tjanczuk/iisnode/blob/master/src/samples/configuration/web.config for a full list of options
    -->
    <!--<iisnode watchedFiles="web.config;*.js"/>-->
  </system.webServer>
</configuration>


20) Open PowerShell and navigate to C:\appl\NodeApps\weather-app
21) Run "Compress-Archive -Path * -DestinationPath ../weather-app.zip -Force"
22) Verify that you have a file named weather-app.zip in folder C:\appl\NodeApps

Update your Web App service with a proper Node version

23) Login to https://portal.azure.com
24) Navigate to your Web App service (your_shortname-app)
25) For your Web App service, select Application settings
26) Add new setting WEBSITE_NODE_DEFAULT_VERSION = 8.9.4 and Save

Deploy the zipped Node project

27) Navigate to your Web App service (shortname-app where shortname is your own user id)
28) From the Overview page, copy the URL (https://shortname-app.azurewebsites.net)
29) Open the URL above in the web browser (https://shortname-app.azurewebsites.net)
30) Navigate to the SCM console for your App service(https://shortname-app.scm.azurewebsites.net)
31) Navigate to Tools > Zip Push Deployment
32) Drag the file C:\appl\NodeApps\weather-app.zip into the ZipDeploy tool in SCM

Navigate to your Web App URL (https://shortname-app.azurewebsites.net)






















