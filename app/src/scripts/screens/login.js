/** @jsx React.DOM */

var React = require('react');
var FluxChildMixin = require('fluxxor').FluxChildMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _ = require('../helpers');

var LoginView = React.createClass({
    mixins: [FluxChildMixin, StoreWatchMixin('LoginStore')],

    getStateFromFlux: function() {
        return  this.getFlux().store('LoginStore').getState();
    },

    renderLoginInput: function() {
        var flux = this.getFlux();

        // This will fire the login action if they keypress is enter
        var login = compose(flux.actions.login.login, _.valIfEnter);

        return (
          <input
            type="email"
            placeholder="Email Address"
            disabled={this.state.emailPending || this.state.email}
            onKeyPress={login} />
        );
    },
  
    renderTokenInput: function() {
        var flux = this.getFlux();

        // This will fire the auth action if they keypress is enter
        var auth = compose(flux.actions.login.auth, _.valIfEnter);

        if (this.state.email) {
            return (
              <input
                type="text"
                placeholder="Auth Token"
                disabled={this.state.tokenPending}
                onKeyPress={auth} />
            );
        }
    },

    render: function() {
        return (
            <div className="login-screen">
                {this.renderLoginInput()}
                {this.renderTokenInput()}
            </div>
        );
    }
});


module.exports = LoginView;
