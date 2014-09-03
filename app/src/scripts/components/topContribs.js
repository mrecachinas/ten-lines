
/** @jsx React.DOM */

var React = require('react/addons');
var Fluxxor = require('fluxxor');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin('FlatStore');
var cx = React.addons.classSet;
var Percent = require('./percent');


var UserPercent = React.createClass({
    render: function() {
        if (!this.props.user) { return false; }

        return (
            <div>
                <strong>{this.props.user.username}</strong>
                :
                <Percent val={this.props.user.percent} />
            </div>
        );
    }
});

var FilterFiles = React.createClass({
    mixins: [FluxChildMixin, StoreWatchMixin],

    getStateFromFlux: function() {
        return this.getFlux().store('FlatStore').getState();
    },

    render: function() {
        var topFive = take(5, this.state.byUser);

        return (
            <div>
                <div>
                    <h1>Top Contributor</h1>
                    <small>% of lines owned in the project</small>
                </div>

                <div className="half">
                    <UserPercent user={head(topFive)} />
                </div>

                <div className="half">
                    {tail(topFive).map(function(user) {
                        return <UserPercent user={user} />;
                    })}
                </div>

            </div>
        );
    }
});

module.exports = FilterFiles;
