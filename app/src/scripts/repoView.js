/** @jsx React.DOM */


var React = require('react');
var Fluxxor = require('fluxxor');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var Filters = require('./components/filterFiles');
var TopContributors = require('./components/topContribs');

var RepoView  = React.createClass({
    mixins: [FluxChildMixin],

    render: function() {
        return (
            <div>
                <h2>Repo View</h2>
                <div className="half">
                    <Filters />
                </div>
                <div className="half">
                    <TopContributors />
                </div>
            </div>
        );
    }
});

module.exports = RepoView;
