

var Repo = function(data) {
    this.setData(data);
};

Repo.prototype.setData = function(data) {
    // These have data
    this.data = data || [];
    this.files = pluck('filename', this.data);
    this.flat = compose(flatten, pluck('contents'))(this.data);

    this.byDate = groupBy(prop('date'), this.flat);
    this.byUser = groupBy(prop('username'), this.flat);
};

Repo.prototype.linesByUser = function(user) {
    return filter(where({username: user}), this.flat);
};


module.exports = Repo;
