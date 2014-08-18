/** @jsx React.DOM */

// Install Ramda to the global namespace first so all scripts can use it
require('ramda').installTo(window);

var React = require('react');

// Fluxxor
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin('LoginStore');
var flux = require('./stores/store');

// Views - These are our main screens of the app
var Login = require('./screens/login');


// A helper function to eliminate boilerplate render code
var render = function(contents) {
    return (
        <div className="app-container">
            {contents}
        </div>
    );
};


var App = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return {
            loginStore: flux.store('LoginStore').getState()
        };
    },

    render: function() {
        return (!this.state.loginStore.isLoggedIn)
                ? render(<Login />)
                : render(<h1>You are now logged in!</h1>);
    }
});


React.renderComponent(
  <App flux={flux} />,
  document.getElementById('app-container')
);

