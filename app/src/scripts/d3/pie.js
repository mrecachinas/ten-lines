var Pie = function(data) {
    this.plot(data);
};

Pie.prototype.crunch = function (data) {
    var udata = { total: 0 };
    for (k in data.byUser) {
        udata[k] = 0;
        for (j in data.byUser[k]) {
            udata[k] += data.byUser[k][j].length;
        }
        udata.total += udata[k];
    }
    return udata;
};

Pie.prototype.plot = function (data) {
    var udata = this.crunch(data);
    nv.addGraph(function() {
        var width = 500,
            height = 500;

        var chart = nv.models.pieChart()
            .x(function(d) { return d.key })
            //.y(function(d) { return d.value })
            //.labelThreshold(.08)
            //.showLabels(false)
            .color(d3.scale.category10().range())
            .width(width)
            .height(height)
            .donut(true);

          chart.pie.donutLabelsOutside(true).donut(true);

          d3.select("#pie")
              //.datum(historicalBarChart)
              .datum(udata)
              .transition().duration(1200)
              .attr('width', width)
              .attr('height', height)
              .call(chart);

        return chart;
    });
};

module.exports = Pie;