
var exports = module.exports = {};

exports.toPairsObj = function(key, value) {
    key = key || 'key';
    value = value || 'value';

    return function(arr) {
        var obj = {};
        obj[key] = arr[0];
        obj[value] = arr[1];
        return obj;
    };
};
