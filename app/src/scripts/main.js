/** @jsx React.DOM */

// Install Ramda to the global namespace first so all scripts can use it
require('ramda').installTo(window);

var $ = require('jquery');
var _ = require('lodash');
var superagent = require('superagent');

var tmpls = {
    loading: require('../templates/loading.handlebars'),
    graphs: require('../templates/graphs.handlebars'),
    filter: require('../templates/filter.handlebars')
};


var Repo = require('./repo');
var Pie = require('./d3/pie');
var Bar = require('./d3/bar');
window.repo = new Repo();

var renderGraphs = function (data) {
    $('.graph-container').html(tmpls.graphs());
    if (data) {
        var pie = new Pie(data);
        var bar = new Bar(data);

        console.log(tmpls.filter({
            title: 'new filter',
            options: [
                {label: 'one'},
                {label: 'two'}
            ]
        }));

        $('#filters').html(tmpls.filter({
            title: 'new filter',
            options: [
                {label: 'one'},
                {label: 'two'}
            ]
        }));
    }
}


$(document).ready(function () {

    renderGraphs();

	$('#username, #repo').keydown(function(e) {
		if (e.keyCode === 13) {
			var username = $('#username').val();
			var repoName = $('#repo').val();


			if (username !== "" && repoName !== "") {
                repo.reset();
                renderGraphs();

                $(".loading").html(tmpls.loading());
                var start = new Date();
                superagent
                    .get('/api/repo/' + username + '/' + repoName)
                    .end(function(res) {
                        if (!res.ok) { return; }
                        repo.setData(res.body);
                        var end = new Date();
                        var elapsed = new Date();
                        elapsed.setTime(end.getTime() - start.getTime());
                        $(".loading").html('Done in ' + elapsed.getSeconds() + ' seconds');
                        renderGraphs(repo);
                        $('html, body').animate({ scrollTop: $('.graph-container').offset().top }, 750);
                    }.bind(this));

			} else {
				$('.response').text('One or more fields empty');
			}
		}
	});
});

