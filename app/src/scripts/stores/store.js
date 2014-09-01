var _ = require('lodash');
var Fluxxor = require('fluxxor');

var data = [
    require('./repo'),
    require('./flat'),
    require('./filters')
];

var stores = _.extend.apply(_, _.pluck(data, 'store'));
var actions = _.extend.apply(_, _.pluck(data, 'actions'));

module.exports = new Fluxxor.Flux(stores, actions);
