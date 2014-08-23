var express = require('express');
var request = require('request');
var _       = require('lodash');
var ramda   = require('ramda');
var app     = express();
var git     = require('gift');
var blame   = require('./server/blame');

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/repo/:username/:repo', function(req, res) {
    var username = req.params.username;
    var repo = req.params.repo;

    var url = 'https://test:test@github.com/'+username+'/'+repo+'.git';
    var dir = '/var/tmp/'+repo+'-'+Math.floor(Math.random()*1000000);

    git.clone(url, dir, function(err, repo) {
        if (err) {
            return res.send('error finding repo');
        }

        blame(dir).then(function(files) {
            res.send(files);
            require('rimraf')(dir, function(error){
                if (error) {
                    console.log('shoot');
                }
            });
        });

    });
});

var server = app.listen(3333, function () {
    console.log('Listening on port %d', server.address().port);
});

exports = module.exports = app;
