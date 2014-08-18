var _ = require('ramda');
var Fluxxor = require('fluxxor');
var request = require('superagent');

// =============================================================================
// Store: Private  API
// =============================================================================
var LoginStore = Fluxxor.createStore({
    // map actions from the dispatcher to our private methods
    actions: {
        'LOGIN': 'login',
        'LOGOUT': 'logout',
        'AUTH': 'auth'
    },

    initialize: function() {
        this.email = false;
        this.emailPending = false;

        this.token = false;
        this.tokenPending = false;
    },

    // This gets called whenever we are trying to submit an email address
    // to generate a token
    login: function(payload) {
        var email = payload.email;
        if (!email) { return; }

        this.emailPending = true;
        this.emit('change');

        setTimeout(function() {
            this.email = email;
            this.emailPending = false;
            this.emit('change');
        }.bind(this), 1000);

        //request
            //.post('/api/auth/gettoken/')
            //.send({ email: email })
            //.end(function(error, res){
                //this.emailPending = false;
                //if (res && res.ok) {
                    ////var data = res.body;
                    //this.email = email;
                //} else {
                    //console.log(res);
                //}

                //this.emit('change');
            //}.bind(this));
    },

    // Once we have an email address, we submit the token for
    // the final steps of validation
    auth: function(payload) {
        var token = payload.token;
        if (!token) { return; }

        this.tokenPending = true;
        this.emit('change');

        setTimeout(function() {
            this.token = token;
            this.tokenPending = false;
            this.emit('change');
        }.bind(this), 1000);

        //request
            //.post('/api/auth/loginwithtoken')
            //.send({ email: this.email, token: token })
            //.end(function(error, res) {
                //if (res && res.ok) {
                    //this.token = token;
                    //this.tokenPending = false;
                    //this.emit('change');
                //} else {
                    //console.log(res);
                //}
            //}.bind(this));
    },

    logout: function() {
        this.email = false;
        this.token = false;
        this.emit('change');
    },

    // Expose our state via this method (for read only protection)
    getState: function() {
        return compose(
            // TODO: Make this check for the cookie instead of email && token
            mixin({isLoggedIn: this.email && this.token}),
            pick(['email', 'emailPending', 'token', 'tokenPending'])
        )(this);
    }
});


// =============================================================================
// Actions: Public API
// =============================================================================
var actions = {
    login: function(email) {
        this.dispatch('LOGIN', {email: email});
    },

    auth: function(token) {
        this.dispatch('AUTH', {token: token});
    },

    logout: function() {
       this.dispatch('LOGOUT');
    }
};


// =============================================================================
// Exports
// =============================================================================
module.exports = {
    store: {LoginStore: new LoginStore()},
    actions: {login: actions}
};
