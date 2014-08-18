// =============================================================================
// Libs
// =============================================================================
var gitblame = require('gitblame');
require('ramda').installTo(global);
var glob = require('glob');
var Q = require('q');
var fs = require('fs');
var lodash = require('lodash');


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

// =============================================================================
// Execution
// =============================================================================

// Make a list of regular expressions to ignore while grepping for files
// This will be based on our gitignore
var ignore = compose(
    map(regexpTest),
    concat(['.*\.min', '\/build\/']),
    reject(regexpTest('#')),
    removeBlanks,
    split('\n')
)(readFile('.gitignore'));

// Ugh, not pure, fix this
// Run the above ignore list of regular expressions over the filename we have
var validFile = function(filename) {
    return reduce(function(memo, r) {
        return memo || !!r(filename);
    }, false, ignore);
};


// Search for all the js files
glob('**/*.js', function(err, files) {
    if (err) {return;}

    var filenames = reject(validFile, files);
    var blamedFiles = map(parse, filenames);

    Q.all(blamedFiles).then(function(files) {
        // At this point we have all the files
        console.log(files);
    });
});

