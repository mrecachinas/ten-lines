/** @jsx React.DOM */

// Install Ramda to the global namespace first so all scripts can use it
require('ramda').installTo(window);

var React = require('react');

// Fluxxor
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin('RepoStore');
var flux = require('./stores/store');

var FetchRepo = require('./components/fetchRepo');
var RepoView = require('./repoView');


// Install Ramda to the global namespace first so all scripts can use it
require('ramda').installTo(window);

var App = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return {
            repoStore: flux.store('RepoStore').getState(),
            filterStore: flux.store('FilterStore').getState()
        };
    },

    render: function() {
        if (this.state.repoStore.raw.length) {
            var repoView = <RepoView
                                repo={this.state.filterStore} />
        }

        return (
            <div>
                <h1>Hello World</h1>
                <FetchRepo repo={this.state.repoStore}/>
                {repoView}
            </div>
        );
    }
});


React.renderComponent(
  <App flux={flux} />,
  document.getElementById('app-container')
);

