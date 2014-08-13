var gitblame = require('gitblame');
require('ramda').installTo(global);
var glob = require('glob');

// Returns the strings length
var strLength = prop('length');
var isEmptyString = not(strLength);

var removeBlanks = filter(strLength);

var regexpTest = invoker('test', RegExp.prototype);



glob('**/*.js', function(err, files) {
    if (err) {return;}



    var restrict = map(regexpTest, [
        'node_modules'
    ]);

    var bools = map()


    files = filter(reg)

    console.log(;
});


var parse = function(filename) {
    gitblame(filename, function(err, lines) {
        if (err) {return;}

        lines = removeBlanks(lines);
    });
}


var rawBlameLineToObject = function(str) {
    //var test = '30acb8d7 (Michael Recachinas 2014-07-28 21:14:25 -0400  5) var app \t= express();'

    var insideParens = /\(([^)]+)\)/.exec(test)[1].split(' ');

    var obj = { };
    obj.commit_hash = /^[A-z0-9]+/.exec(test)[0];
    obj.username = insideParens[0] + ' ' + insideParens[1];
    obj.date = insideParens[2];
    obj.time = insideParens[3];
    obj.line_no = insideParens[insideParens.length - 1];
    obj.code_value = /\)(.|\n)*/.exec(test)[0].split(' ').slice(1).join(' ');

    return obj;
};


