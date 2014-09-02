/** @jsx React.DOM */

var React = require('react');
var Fluxxor = require('fluxxor');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var FetchRepo = React.createClass({
    mixins: [FluxChildMixin],

    onKeyPress: function(e) {
        if (e.key === 'Enter') {
            var username = this.refs.username.getDOMNode().value;
            var repo = this.refs.repo.getDOMNode().value;
            if (username.length && repo.length) {
                this.getFlux().actions.repo.fetch(username, repo);
            }
        }
    },

    render: function() {
        var loading = this.props.repo.fetching ? (<i className="ion-looping"></i>) : false;

        return (
            <div className="input">
                <input
                    id="username"
                    ref="username"
                    type="text"
                    onKeyPress={this.onKeyPress}
                    placeholder="GitHub Username" />

                <span> / </span>

                <input
                    id="repo"
                    ref="repo"
                    type="text"
                    onKeyPress={this.onKeyPress}
                    placeholder="Repo Name" />

                <div className="response">
                    {loading}
                    <span className="error">
                        {this.props.repo.error ? this.props.repo.error : ''}
                    </span>
                </div>
            </div>
        );
    }
});

module.exports = FetchRepo;
