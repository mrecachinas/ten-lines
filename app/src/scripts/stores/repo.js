var _ = require('ramda');
var Fluxxor = require('fluxxor');
var superagent = require('superagent');


// =============================================================================
// Store: Private  API
// =============================================================================
var RepoStore = Fluxxor.createStore({
    // map actions from the dispatcher to our private methods
    actions: {
        'REPO:RESET': 'reset',
        'REPO:FETCH': 'fetch',
        'REPO:ERROR': 'setError'
    },

    initialize: function() {
        this.raw = [];
        this.fetching = false;
        this.error = false;
    },

    reset: function(payload) {
        this.fetching = false;
        this.error = false;

        this.raw = map(function(obj) {
            var filename = obj.filename.split('/').slice(4).join('/');
            var contents = map(mixin({filename: filename}), obj.contents);
            return {
                filename: filename,
                contents: contents
            };
        }, payload.data);

        this.emit('change');
    },

    fetch: function() {
        this.error = false;
        this.fetching = true;
        this.emit('change');
    },

    setError: function(payload) {
        this.error = payload.error;
        this.fetching = false;
        this.emit('change');
    },

    // Expose our state via this method (for read only protection)
    getState: function() {
        return compose(
            pick(['raw', 'fetching', 'error'])
        )(this);
    }
});


// =============================================================================
// Actions: Public API
// =============================================================================
var actions = {
    fetch: function(username, repoName) {
        this.dispatch('REPO:FETCH');

        superagent
            .get('/api/repo/' + username + '/' + repoName)
            .end(function(res) {
                if(!res.body) {
                    this.dispatch('REPO:ERROR', {error: 'No repo found'});
                } else if (require('lodash').isString(res.body)) {
                    this.dispatch('REPO:ERROR', {error: res.body});
                } else {
                    this.dispatch('REPO:RESET', {data: res.body});
                }
            }.bind(this));
    }
};


// =============================================================================
// Exports
// =============================================================================
module.exports = {
    store: {RepoStore: new RepoStore()},
    actions: {repo: actions}
};
