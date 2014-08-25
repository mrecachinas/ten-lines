/** @jsx React.DOM */

// Install Ramda to the global namespace first so all scripts can use it
require('ramda').installTo(window);

var $ = require('jquery');
var _ = require('lodash');
var superagent = require('superagent');

var tmpls = {
    loading: require('../templates/loading.handlebars')
};


var Repo = require('./repo');
var Pie = require('./d3/pie');
var Bar = require('./d3/bar');
window.repo;


$(document).ready(function () {
	$('input').keydown(function(e) {
		if (e.keyCode === 13) {
			var username = $('#username').val();
			var repoName = $('#repo').val();

			var filetypes = ($('#filetypes').val() || '')
                .replace(/,/g, '')
                .replace(/\./g, '')
                .split(' ');

			if (username !== "" && repoName !== "") {

                $(".loading").html(tmpls.loading());
                var start = new Date();
                superagent
                    .get('/api/repo/' + username + '/' + repoName)
                    .query({filetypes: filetypes})
                    .end(function(res) {
                        if (!res.ok) { return; }
                        repo = new Repo(res.body);
                        var end = new Date();
                        var elapsed = new Date();
                        elapsed.setTime(end.getTime() - start.getTime());
                        $(".loading").html('Done in ' + elapsed.getSeconds() + ' seconds');
                        pie = new Pie(repo);
                        // bar = new Bar(repo);
                        $('html, body').animate({ scrollTop: $('.graph-container').offset().top }, 750);
                    }.bind(this));

			} else {
				$('.response').text('One or more fields empty');
			}
		}
	});
});

