var Fluxxor = require('fluxxor');
var _ = require('../utils');

var groupAndSort = function(key, value) {
    key = key || 'key';
    value = value || 'value';

    return compose(
        reverse,
        sortBy(prop(value)),
        map(_.toPairsObj(key, value)),
        toPairs,
        countBy(prop(key))
    );
};

// =============================================================================
// Store: Private  API
// =============================================================================
var FlatStore = Fluxxor.createStore({
    // map actions from the dispatcher to our private methods
    actions: {
        'REPO:RESET': 'update',
        'FILTER:UPDATED': 'update'
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
                map(function(obj) {
                    return mixin(obj, {
                        percent: ('' + (obj.count / flat.length) * 100).substring(0, 6)
                    });
                }),
                groupAndSort('username', 'count')
            )(this.flat);

            this.byDate = compose(
                reverse,
                sortBy(prop('date')),
                groupAndSort('date', 'count')
            )(this.flat);

            console.log(last(this.byDate).date);

            this.emit('change');
        });
    },


    // Expose our state via this method (for read only protection)
    getState: function() {
        return compose(
            pick(['flat', 'byUser', 'byDate'])
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
