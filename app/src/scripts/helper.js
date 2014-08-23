var repo = {};

var parseJSON = function(json) {
	return JSON.parse(json);
};

$(document).ready(function () {
	$('input').keydown(function(e) {
		if (e.keyCode === 13) {
			var username = $("#username").val();
			var repoName = $('#repo').val();
			if (username !== "" && repoName !== "") {
				$.ajax({
					url: "/repo/" + username + "/" + repoName,
				}).done(function(data) {
					console.log(data);
					repo = parseJSON(data);
					linesPerPerson(repo);

				});
			} else {
				$('.response').text('One or more fields empty');
			}
		}
	});
});

var linesPerPerson = function(repo) {
	return _.filter(repo, function() {

	});
};

var getUsers = function(repo) {
	return _.uniq(repo, function() {
		return 
	});
};

var history = function(repo) {

};