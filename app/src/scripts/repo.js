

var Repo = function(data) {
    this.setData(data);
};

Repo.prototype.setData = function(data) {
    // These have data
    this.data = data || [];
    this.files = pluck('filename', this.data);
    this.flat = compose(flatten, pluck('contents'))(this.data);


    // Helpers
    var dates = groupBy(prop('date'));
    var users = groupBy(prop('username'));

    this.byDate = compose(
        mapObj(users),
        dates
    )(this.flat);

    this.byUser = compose(
        mapObj(dates),
        users
    )(this.flat);

    return this;
};



module.exports = Repo;
