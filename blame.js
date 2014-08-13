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


};


