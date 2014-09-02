var Fluxxor = require('fluxxor');

// =============================================================================
// Store: Private  API
// =============================================================================
var FlatStore = Fluxxor.createStore({
    // map actions from the dispatcher to our private methods
    actions: {
        'REPO:RESET': 'update',
        'FLAT:UPDATE': 'update'
    },

    initialize: function() {
        this.flat = [];
        this.byUser = [];
    },

    update: function() {
        this.waitFor(['FilterStore'], function(filterStore) {
            var filtered = filterStore.getState().filtered;

            var flat = this.flat = compose(flatten, pluck('contents'))(filtered);

            this.byUser = compose(
                reverse,
                sortBy(prop('count')),
                map(function(arr) {
                    return {
                        username: arr[0],
                        count: arr[1],
                        percent: ('' + (arr[1] / flat.length) * 100).substring(0, 6)
                    }
                }),
                toPairs,
                countBy(prop('username'))
            )(this.flat);

            this.emit('change');
        });
    },


    // Expose our state via this method (for read only protection)
    getState: function() {
        return compose(
            pick(['flat', 'byUser'])
        )(this);
    }
});


// =============================================================================
// Actions: Public API
// =============================================================================
var actions = {
    //addExtension: function(ext) {
        //this.dispatch('FILTER:EXTENSION', {ext: ext});
    //}
};


// =============================================================================
// Exports
// =============================================================================
module.exports = {
    store: {FlatStore: new FlatStore()},
    actions: {flat: actions}
};
