/** @jsx React.DOM */

var React = require('react/addons');
var Fluxxor = require('fluxxor');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin('FlatStore');
var cx = React.addons.classSet;
var Percent = require('./percent');


var FilterFiles = React.createClass({
    mixins: [FluxChildMixin, StoreWatchMixin],

    getStateFromFlux: function() {
        return this.getFlux().store('FlatStore').getState();
    },

    render: function() {
        return (
            <div>
                <h1> Get Mathed </h1>
                <small>Lines of code per day</small>

                <p> Average: {Math.round(this.state.average)} </p>
                <p> Median: {Math.round(this.state.median)} </p>
            </div>
        );
    }
});

module.exports = FilterFiles;
