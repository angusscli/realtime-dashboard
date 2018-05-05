

 var data;
socket.on('chart2', function(value){

	console.log("chart2 socket.on");
  var data = JSON.parse(value)
  /*
  console.log("================");
console.log(value);
*/
  
var w = window,
d = document,
e = d.documentElement,
g = d.getElementsByTagName('body')[0],
//x = w.innerWidth || e.clientWidth || g.clientWidth,
//y = w.innerHeight|| e.clientHeight|| g.clientHeight;

x = 380;
y = 338;

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = x - margin.left - margin.right,
    height = y - margin.top - margin.bottom;


//var data = [{password:"text",category:"A","size":40},{password:"text2",category:"A","size":20},{password:"text33",category:"B","size":10},{password:"text3",category:"A","size":10}];

var categories = d3.keys(d3.nest().key(function(d) { return d.category; }).map(data));
var color = d3.scale.ordinal().range(["#bbb","#bbb","#bbb","#bbb","#bbb"]);
var fontSize = d3.scale.pow().exponent(5).domain([0,1]).range([10,80]);

var layout = d3.layout.cloud()
    .timeInterval(10)
    .size([width, height])
    .words(data)
    .rotate(function(d) { return 0; })
    .font('monospace')
    .fontSize(function(d) { return d.size; })
    .text(function(d) { return d.password; })
    .spiral("archimedean")
    .on("end", draw)
    .start();

d3.select('#chart2').select("svg").remove();

var svg = d3.select('#chart2').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var wordcloud = svg.append("g")
    .attr('class','wordcloud')
    .attr("transform", "translate(" + width/2 + "," + height/4 + ")");

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
    .domain(categories);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll('text')
    .style('font-size','20px')
    .style('fill',function(d) { return color(d); })
    .style('font','sans-serif');

function draw(words) {
  wordcloud.selectAll("text")
      .data(words)
    .enter().append("text")
      .attr('class','word')
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", function(d) { return d.font; })
      .style("fill", function(d) { 
          var paringObject = data.filter(function(obj) { return obj.password === d.text});
          return color(paringObject[0].category); 
      })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
      .text(function(d) { return d.text; });
};

});

