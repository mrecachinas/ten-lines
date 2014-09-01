/** @jsx React.DOM */


var React = require('react');
var Fluxxor = require('fluxxor');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var Filters = require('./components/filterFiles');

var RepoView  = React.createClass({
    mixins: [FluxChildMixin],

    render: function() {
        return (
            <div>
                <h2>Repo View</h2>
                <Filters repo={this.props.filtered} />
            </div>
        );
    }
});

module.exports = RepoView;
