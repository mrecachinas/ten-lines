// =============================================================================
// Libs
// =============================================================================
require('ramda').installTo(global);
var glob = require('glob');
var Q = require('q');
var fs = require('fs');
var lodash = require('lodash');
var exec = require('child_process').exec;
var path = require('path');

var gitblame = function(file, cb) {
  var dirname = path.dirname(file);
  var filename = path.basename(file);
  var options = {cwd: dirname, maxBuffer: 1024* 1024 * 1024};
  exec('git blame ' + filename, options, function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
        return cb(new Error(error));
      }
      var lines = stdout.split("\n");
      lines.unshift(""); // make the line numbers match
      cb(null, lines);
  });
};

// =============================================================================
// Helpers
// =============================================================================
// Returns the strings length
var strLength = prop('length');
var isEmptyString = not(strLength);

// Filters out blank strings from an array
var removeBlanks = filter(strLength);

// Expose the test method from RegExp as a curried function
// Since we are possibly passing in invalid regular expressions via the
// .gitignore file, wrap this in a try
var regexpTest = curry(function(r, str) {
    try {
        var reg = lodash.isRegExp(r) ? r : new RegExp(r);
        return reg.test(str);
    } catch(err) {}
});


// A simple function to read files, used for mapping and such
var readFile = function(file) {
    return fs.readFileSync(file, 'utf8');
}


// Takes in a raw filename and returns a promise. When the git blame command
// runs, it will crunch it and return an array of files {filename, contents}
var parse = function(filename) {
    var deferred = Q.defer();

    gitblame(filename, function(err, lines) {
        if (err) {return deferred.reject();}

        lines = removeBlanks(lines);

        deferred.resolve({
            filename: filename,
            contents: map(rawBlameLineToObject, lines)
        });
    });

    return deferred.promise;
}


// Takes in a string from the gitblame file and converts it into an object
var rawBlameLineToObject = function(str) {
    var insideParens = /\(([^)]+)\)/.exec(str)[1].split(' ');

    var obj = { };
    obj.commit_hash = /^[A-z0-9]+/.exec(str)[0];
    obj.username = insideParens[0] + ' ' + insideParens[1];
    obj.date = insideParens[2];
    obj.time = insideParens[3];
    obj.line_no = insideParens[insideParens.length - 1];
    obj.code_value = /\)(.|\n)*/.exec(str)[0].split(' ').slice(1).join(' ');

    return obj;
};


module.exports = function(path) {
    var deferred = Q.defer();

    if (!path) {
        deferred.resolve([]);
    };

    glob(path + '/**/*.js', function(err, files) {
        if (err) {return deferred.resolve([]);}

        var blamedFiles = map(parse, files);

        Q.all(blamedFiles).then(function(files) {
            deferred.resolve(files);
        });
    });

    return deferred.promise
}
