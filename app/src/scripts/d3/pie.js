var Pie = function(data) {
    this.plot(data);
};

Pie.prototype.crunch = function (data) {
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

Pie.prototype.plot = function (data) {
    var udata = this.crunch(data);
    nv.addGraph(function() {
        var width = 500,
            height = 500;
        var chart = nv.models.pieChart()
            .x(function(d) { return d.x })
            .y(function(d) { return d.y })
            .labelThreshold(.04)
            // .showLabels(false)
            .showLegend(false)
            .color(d3.scale.category10().range())
            .width(width)
            .height(height);
          d3.select("#pie")
              .datum(udata)
              .transition().duration(1200)
              .attr('width', width)
              .attr('height', height)
              .attr('viewBox', '0, 0, ' + width + ', ' + height)
              .attr('preserveAspectRatio', 'xMinYMin')
              .call(chart);
        return chart;
    });
};

module.exports = Pie;