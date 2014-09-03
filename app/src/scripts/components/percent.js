/** @jsx React.DOM */

var React = require('react/addons');

var Percent = React.createClass({
    render: function() {
        var val = (''+this.props.val).substring(0, 5);
        return (
            <span>
                {val}%
            </span>
        );
    }
});

module.exports = Percent;
