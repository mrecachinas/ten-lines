/**
 * @jsx React.DOM
 */

// External Libraries
var React = require('react');
var moment = require('moment');

var DateSpan = React.createClass({
    render: function() {
        var date = this.props.children;
        date = moment(date).format('MMM Do YY')

        return (
            <span className="date">{date}</span>
        );
    }
});


module.exports = DateSpan;
