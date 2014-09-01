var _ = require('ramda');
var Fluxxor = require('fluxxor');
var superagent = require('superagent');

// =============================================================================
// Store: Private  API
// =============================================================================
var FilterStore = Fluxxor.createStore({
    // map actions from the dispatcher to our private methods
    actions: {
        'REPO:RESET': 'filter',
        'FILTER:FILE': 'fileFilter',
        'FILTER:USER': 'userFilter',
        'FILTER:EXTENSION': 'extensionFilter',
        'FILTER:RESET': 'resetFilter'
    },

    initialize: function() {
        this.files = [];
        this.filtered = [];
        this.extensions = [];
        this.username = false;
    },

    filter: function() {
        this.waitFor(['RepoStore'], function(repoStore) {
            this.filtered = repoStore.getState().raw;

            // Use this to see if a string matches a regexp in an array
            var reduceOrRegExp = curry(function(regs, file) {
                return reduce(function(memo, r) {
                    return memo || r.test(file.filename);
                }, false, regs);
            });

            // Filter based on the files the user selected
            var regs = map(function(file) { return new RegExp(file); }, this.files);
            this.filtered = reject(reduceOrRegExp(regs), this.filtered);

            // Filter based on the files the user selected
            var regs = map(function(file) { return new RegExp(file + '$'); }, this.extensions);
            this.filtered = reject(reduceOrRegExp(regs), this.filtered);

            // Filter based on the username
            var nameFilter = this.username
                                ? new RegExp(this.username, 'gi')
                                : {test: alwaysTrue};

            this.filtered = map(function(file) {
                // Remove any lines that are not by the user
                var contents = filter(function(line) {
                    return  nameFilter.test(line.username);
                }, (file.contents || []));

                return {
                    filename: file.filename,
                    contents: contents
                };
            }, this.filtered);


            // Remove any empty files
            this.filtered = filter(function(file) {
                return file.contents.length > 0;
            }, this.filtered);

            this.emit('change')
        });
    },

    userFilter: function(payload) {
        this.username = payload.username;
        this.filter();
    },

    fileFilter: function(payload) {
        if (!payload.filter) { return; }
        this.files = union(this.files, [payload.filter]);
        this.filter();
    },

    extensionFilter: function(payload) {
        if (!payload.ext) { return; }
        this.extensions = union(this.extensions, [payload.ext]);
        this.filter();
    },

    resetFilter: function() {
        this.files = [];
        this.username = false;
        this.extensions = [];
        this.filter();
    },

    // Expose our state via this method (for read only protection)
    getState: function() {
        var active = this.files.length || this.extensions.length || this.username;

        return compose(
            mixin({active: active}),
            pick(['filtered', 'active'])
        )(this);
    }
});


// =============================================================================
// Actions: Public API
// =============================================================================
var actions = {
    addFilter: function(filename) {
        this.dispatch('FILTER:FILE', {filter: filename});
    },
    userFilter: function(username) {
        this.dispatch('FILTER:USER', {username: username});
    },
    resetFilters: function() {
        this.dispatch('FILTER:RESET');
    },
    addExtension: function(ext) {
        this.dispatch('FILTER:EXTENSION', {ext: ext});
    }
};


// =============================================================================
// Exports
// =============================================================================
module.exports = {
    store: {FilterStore: new FilterStore()},
    actions: {filter: actions}
};
