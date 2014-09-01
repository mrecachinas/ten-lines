
/** @jsx React.DOM */

var React = require('react/addons');
var Fluxxor = require('fluxxor');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin('FlatStore');
var cx = React.addons.classSet;


var UserPercent = React.createClass({
    render: function() {
        if (!this.props.user) { return false; }

        return (
            <div>
                <strong>{this.props.user.username}</strong>
                :
                <strong>{this.props.user.percent}</strong>
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
                <h1>Top Contributor</h1>

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
