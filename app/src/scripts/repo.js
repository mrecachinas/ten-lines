
var Repo = function(data) {
    this.setData(data);
};

Repo.prototype.setData = function(data) {
    // These have data
    this.raw = data || [];
    this.data = this.raw;
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

    var isVaried = compose(
        function(arr) { return arr.length > 1 },
        uniq,
        pluck('username'),
        prop('contents')
    );

    // This is a list of lines that are not 100% by one user (typically just
    // added and forgot about)
    this.nonFull = compose(
        //flatten,
        //pluck('contents'),
        filter(isVaried)
    )(this.raw)

    //this.topContribs = compose(
        //countBy(prop('username'))
    //)(this.nonFull);

    return this;
};

Repo.prototype.reset = function() {
    this.setData();
};



module.exports = Repo;











//var log = function(arg) {
    //console.log(arg);
//}

//var arrAt = curry(function(index, arr) {
    //return arr[index];
//})


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

