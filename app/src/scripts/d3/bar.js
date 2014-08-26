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

Bar.prototype.plot = function (data) {
    dates = this.crunch(data);
    nv.addGraph(function() {
        var width2 = 500,
            height2 = 500;
        var chart = nv.models.multiBarChart()
          .transitionDuration(350)
          .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
          .rotateLabels(0)      //Angle to rotate x-axis labels.
          .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
          .groupSpacing(0.01)    //Distance between each group of bars.
          .showLegend(false)
          .width(width2)
          .height(height2);
        ;

        chart.xAxis
            .tickFormat(x_fmt);

        chart.yAxis
            .tickFormat(d3.format(',r'));

        d3.select('#bar')
            .datum(dates)
            .transition().duration(1200)
              .attr('width', width2)
              .attr('height', height2)
              .attr('viewBox', '0, 0, ' + width2 + ', ' + height2)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
    d3.selectAll("input").on("change", change);

    var timeout = setTimeout(function() {
      d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
    }, 2000);

    function change() {
      clearTimeout(timeout);
      if (this.value === "grouped") transitionGrouped();
      else transitionStacked();
    }

    function transitionGrouped() {
      y.domain([0, yGroupMax]);

      rect.transition()
          .duration(500)
          .delay(function(d, i) { return i * 10; })
          .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
          .attr("width", x.rangeBand() / n)
        .transition()
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y(d.y); });
    }
};

module.exports = Bar;