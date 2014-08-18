
var Router = require('director').Router;
var flux = require('./stores/store');
var _ = require('lodash');


// This gets called whenever we search for something via the SEARCH action
//flux.store('PostStore').on('change', function() {
    //var params = flux.store('PostStore').getState().params;
    //var url = '';

    //url += params.channel ? 'channel/' + params.channel : '';
    //url += params.username ? 'username/' + params.username : '';
    //console.log(url);

    //router.setRoute(url);
//});


// This gets called whenever the url changes manually
var search = function(key) {
    var keys = _.toArray(arguments);

    return  function(val) {
        var vals = _.toArray(arguments);

        var params = _.zipObject(keys, vals)

        flux.actions.search(params)
    };
};

var routes = {
    '/username/:username'                   : search('username'),
    '/channel/:channel'                     : search('channel'),
    '/channel/:channel/username/:username'  : search('channel', 'username'),
    '/'                                     : search()
};

var router = Router(routes);
router.init('/');

module.exports = router;
