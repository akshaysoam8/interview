var express = require('express');
var http = require('http');
var chalk = require('chalk');
var path = require('path');
var nconf = require('nconf');
var bodyParser = require('body-parser');
var fs = require('fs');
var _async = require('async');

var app = express();
var server = http.createServer(app);

nconf.file(path.join(__dirname, 'config', 'config.json'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

server.listen(process.env.port || 80, function(err) {
    console.log(err ? err : chalk.green('Server is running', new Date()));
});

app.post('/car', function(req, res) {
    if(!req.body.year || !req.body.model || isNaN(req.body.year)) {
        res.send(400);
        return;
    }

    var data = req.body.year + ', ' + req.body.model + '\n';

    fs.appendFile('data.csv', data, function(err) {
        if(err) {
            console.log(err);
            res.send(500);
        }

        else
            res.send(200);
    });
});

app.get('/cars', function (req, res) {
    var lines = fs.readFileSync('data.csv').toString().split('\n');
    var result = new Array();

    lines.forEach(function(line) {
        if(line.length == 0)
            return;

        var split = line.split(', ');

        result.push({
            year : split[0],
            model : split[1]
        });
    });

    res.send(result);
});

app.get('*', function(req, res) {
    res.sendfile('index.html');
});
