require('ramda').installTo(global);
var express = require('express');
var request = require('request');
var _       = require('lodash');
var ramda   = require('ramda');
var app     = express();
var git     = require('gift');
var blame   = require('./server/blame');


var Datastore = require('nedb')
var repos = new Datastore({ filename: './dbs/repos', autoload: true });
repos.remove({}, function (err, numRemoved) {
});



app.get('/repo/:username/:repo', function(req, res) {
    var username = req.params.username;
    var repo = req.params.repo;
    var id = username + '/' + repo;

    var url = 'https://test:test@github.com/'+id+'.git';
    var dir = '/var/tmp/'+repo+'-'+Math.floor(Math.random()*1000000);

    repos.findOne({ repo: id }, function (err, doc) {
        if (err) {
            return res.send('something went wrong with the db sorry dude');
        }

        if (!doc) {
            git.clone(url, dir, function(err, repo) {
                if (err) {
                    return res.send('error finding repo');
                }

                blame(dir).then(function(files) {
                    repos.insert({
                        repo: id,
                        files: files,
                        date: Date.now()
                    });

                    setTimeout(function() {
                        require('rimraf')(dir, function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }, 1000);

                    res.send(files);
                });
            });
        } else {
            res.send(doc.files);
        }
    });
});

var server = app.listen(3333, function () {
    console.log('Listening on port %d', server.address().port);
});

exports = module.exports = app;
