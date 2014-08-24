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
window.repo;



$(document).ready(function () {
	$('input').keydown(function(e) {
		if (e.keyCode === 13) {
			var username = $('#username').val();
			var repoName = $('#repo').val();
			if (username !== "" && repoName !== "") {

                $(".graph-container").html(tmpls.loading());

                superagent
                    .get('/api/repo/' + username + '/' + repoName)
                    .end(function(res) {
                        if (!res.ok) { return; }
                        repo = new Repo(res.body);

                        $(".graph-container").html('Done');
                    }.bind(this));

			} else {
				$('.response').text('One or more fields empty');
			}
		}
	});
});

