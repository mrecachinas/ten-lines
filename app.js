var express = require('express');
var request = require('request');
var _		= require('rambda');
var app 	= express();

app.get('/', function(req, res) {
	res.send('Hello World');
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;