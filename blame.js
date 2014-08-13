var gitblame = require('gitblame');
require('ramda').installTo(global);

// Returns the strings length
var strLength = prop('length');
var isEmptyString = not(strLength);

var removeBlanks = filter(strLength);


var parse = function(filename) {
    gitblame(filename, function(err, lines) {
        if (err) {return;}

        lines = removeBlanks(lines);
    });
}


var rawBlameLineToObject = function(str) {


};


parse('app.js');

