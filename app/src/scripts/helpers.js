
var e = module.exports = {};
var _ = require('ramda');

e.inputVal = function(e) {
    return e && e.target && e.target.value;
};

e.ifEnter = function(e) {
    if (e.key === 'Enter') {
        return e;
    }
};

e.valIfEnter = compose(e.inputVal, e.ifEnter);

