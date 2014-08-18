var _ = require('lodash');
var Fluxxor = require('fluxxor');

var data = [
    require('./login')
];

var stores = _.extend.apply(_, _.pluck(data, 'store'));
var actions = _.extend.apply(_, _.pluck(data, 'actions'));

module.exports = new Fluxxor.Flux(stores, actions);

