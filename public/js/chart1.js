    var chartdata1 = [
      {key: "Negative", y: 1, color: "red"},
      {key: "Positive", y: 1, color: "green"},
      {key: "Neutral", y: 1, color: "grey"}
    ];

var chart1;


nv.addGraph(function() {
        chart1 = nv.models.pieChart()
            .x(function(d) { return d.key })
            .y(function(d) { return d.y })
            .donut(true)
            .margin({top:10})
            .padAngle(.08)
            .cornerRadius(5)
            .showLegend(false)
            .id('donut1'); // allow custom CSS for this one svg

        chart1.pie.donutLabelsOutside(true).donut(true);
        d3.select("#chart1 svg")
            .datum(chartdata1)
            .transition().duration(1200)
            .call(chart1);

        nv.utils.windowResize(chart1.update);
        return chart1;
    });



socket.on('chart1', function(value){
	console.log("chart1 socket.on");
  var data= JSON.parse(value)

document.getElementById('score').innerText=data.avg;
  
for (const entry of chartdata1.entries()) {
  	//{"key":"Positive","y":10}
    if(entry[1].key=="Negative") {
      entry[1].y = data.neg

    }
    if(entry[1].key=="Positive") {
        entry[1].y = data.pos
      }
    if(entry[1].key=="Neutral") {
        entry[1].y = data.neutral
      }
  }
if (chart1!=undefined) {
  d3.select("#chart1 svg")
      .datum(chartdata1)
      .transition().duration(1200)
      .call(chart1);
}
});



