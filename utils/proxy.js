/* global module: false, require: false, console: false, __dirname: false */

var path = require('path');
var request = require('request');
var express = require('express');
var app = express();

var devUrl = 'http://192.168.1.70:20144/';

app.use(express.logger('dev'));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(app.router);

module.exports = function (options) {

    options = options || {};
    var port = options.port || 4444;
    console.log(port);
    var staticRoot = options.staticRoot || path.join(__dirname, '..', 'app');

    app.use(express['static'](staticRoot));

    app.all('*/api/*', function(req, res) {
        var url = devUrl + req.url.replace('/api/', '');
        console.log('[' + req.method + '] ' + url);

        req.pipe(request({
            method: req.method,
            url: url,
            json: req.body
        })).pipe(res);
    });

    return app.listen(port, function () {
        console.log('Now listening on port ' + port);
    });
};
