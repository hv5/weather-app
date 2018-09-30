var http = require('http');
var request = require('request');
var url = require('url');

var apiKey = 'a2d6d978685ade382f71c7c863b40d2a';


var server = http.createServer(function(req, resp) {

    var query = url.parse(req.url, true).query;

    var city = query.city;
    if (city == null)
        city = 'stavanger';

    var apiEndpoint = 'http://api.openweathermap.org/data/2.5/weather?units=metric&q=' + city + '&appid=' + apiKey;
    console.log(apiEndpoint);

    request(apiEndpoint, function(err, res, body) {
        var data = JSON.parse(body);

        if (data.name == null) {
            resp.end("No weather forecast for " + city);
            return;
        }

        resp.write("<html><body style=\"background-color:#1a5276; color:white\">");

        // City header
        resp.write("<div>");
        resp.write("<p style=\"margin:8px; font-size:36px\">" + data.name + "&nbsp");
        resp.write("<span style=\"font-size:16px\">" + data.sys.country) + "</span>"
        resp.write("</p>");
        resp.write("<hr>");
        resp.write("</div>");

        // Weather details
        resp.write("<div style=\"margin:20px\">");
        resp.write("<p style=\"font-size:64px; margin:0px\">" + Math.round(data.main.temp) + "&#176" + "</p>");
        resp.write("<p style=\"font-size:24px; margin:0px\">" + (data.weather[0].description).toUpperCase() + "</p>");
        
        resp.write("<p>" + 'Wind: ' + data.wind.speed + " m/s" + "</p>");
        resp.write("<p>" + 'Pressure: ' + data.main.pressure + " mbar" + "</p>");
        resp.write("<p>" + 'Humidity: ' + data.main.humidity + " %" + "</p>");
        
        resp.write("</div>");

        resp.write("<hr>");
        resp.write("<p style=\"font-size:10px\">" + '(' + req.headers.host + ')' + "</p>");

        resp.write("</body></html>");
        resp.end();
    });  
});
server.listen(3000);
