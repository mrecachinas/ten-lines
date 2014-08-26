var lodash = require('lodash');

var match = {};
var x_fmt = function (num) {
    return match[num];
}

var Bar = function(data) {
    this.plot(data);
};

Bar.prototype.crunch = function (data) {
    var dates = [];
    var count = 0;
    for (u in data.byUser) {
        var outer = {};
        outer.key = u;
        var values = [];
        for (d in data.byUser[u]) {
            var obj = {};
            var intd = parseInt(d.split('-').join('')) || '';
            obj.x = intd;
            match[intd] = d;
            obj.y = data.byUser[u][d].length;
            values.push(obj);
        }
        outer.values = values;
        dates.push(outer);
    }
    for (var i = 0; i < dates.length; i++) {
        dates[i].values = lodash.sortBy(dates[i].values, 'x');
    }
    return dates;
};

/*
[ 
  {
    key: USERNAME,
    values: {
      DATE: {
        x: DATE,
        y: LOC
      }
    } 
  }
]
*/

Bar.prototype.plot = function (data) {
    dates = this.crunch(data);
    nv.addGraph(function() {
        var chart = nv.models.multiBarChart()
          .transitionDuration(350)
          .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
          .rotateLabels(90)      //Angle to rotate x-axis labels.
          .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
          .groupSpacing(0.1)    //Distance between each group of bars.
          .showLegend(false);
        ;

        chart.xAxis
            .tickFormat(x_fmt);

        chart.yAxis
            .tickFormat(d3.format(',r'));

        d3.select('#bar')
            .datum(dates)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });

};

module.exports = Bar;