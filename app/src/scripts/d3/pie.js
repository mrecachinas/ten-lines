var Pie = function(data) {
    plot(data);
};

var crunch = function (data) {
    var udata = [];
    var count = 0;
    for (k in data.byUser) {
        var obj = {};
        obj.x = k;
        obj.y = 0;
        udata.push(obj);
        for (j in data.byUser[k]) {
            udata[count].y += data.byUser[k][j].length;
        }
        count++;
    }
    return udata;
};

var plot = function (data) {
    var udata = crunch(data);
    nv.addGraph(function() {
        var width = 500,
            height = 500;
        var chart = nv.models.pieChart()
            .x(function(d) { return d.x })
            .y(function(d) { return d.y })
            //.labelThreshold(.08)
            //.showLabels(false)
            .color(d3.scale.category10().range())
            .width(width)
            .height(height)
            .donut(true);
          // chart.pie.donutLabelsOutside(true).donut(true);
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