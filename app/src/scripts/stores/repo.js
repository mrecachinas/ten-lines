var _ = require('ramda');
var Fluxxor = require('fluxxor');
var superagent = require('superagent');


//var filenamestuff = reduce(function(memo, obj){
    //var lines = map(mixin({filename: obj.filename}), obj.contents);
    //return concat(memo, lines);
//}, []);

//var flatWIthNames = filenamestuff(repo.raw)
//var byFile = groupBy(prop('filename'), flatWIthNames)

//var isVaried = compose(
    //function(arr) { return arr.length > 1 },
    //uniq,
    //pluck('username'),
    //arrAt(1)
//);


//var arrPairs = compose(
    //filter(function() {})
    //filter(isVaried)
//)(toPairs(byFile))

//log(arrPairs)


// =============================================================================
// Store: Private  API
// =============================================================================
var RepoStore = Fluxxor.createStore({
    // map actions from the dispatcher to our private methods
    actions: {
        'REPO:RESET': 'reset',
        'REPO:FETCH': 'fetch'
    },

    initialize: function() {
        this.raw = [];
        this.fetching = false;
    },

    reset: function(payload) {
        this.fetching = false;

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
        this.fetching = true;
        this.emit('change');
    },

    // Expose our state via this method (for read only protection)
    getState: function() {
        return compose(
            pick(['raw', 'fetching'])
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
                if (!res.ok) { return; }
                this.dispatch('REPO:RESET', {data: res.body});
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
