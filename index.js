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
