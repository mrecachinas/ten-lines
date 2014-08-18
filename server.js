var express = require('express');
var request = require('request');
var _		= require('lodash');
var ramda	= require('ramda');
var app 	= express();

app.get('/', function(req, res) {
	res.send('Hello World');
});

var server = app.listen(3000, function () {
	console.log('Listening on port %d', server.address().port);
});
exports = module.exports = app;