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

app.get('*', function(req, res) {
    res.sendfile('index.html');
});
