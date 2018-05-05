

   // create the chart
   var chart3;

   const maxValue = 1
   const minValue = -1
   const ticks = 100

   const niceYScale = d3.scale.linear()
     .domain([minValue, maxValue])
     .nice(ticks);
   
   nv.addGraph(function() {
       chart3 = nv.models.scatterChart()
           .showDistX(true)
           .showDistY(true)
           .useVoronoi(true)
           .color(  [d3.rgb("green"), d3.rgb("red")] )
           .duration(300)
           .forceY(niceYScale.domain())
       ;
       chart3.dispatch.on('renderEnd', function(){
           console.log('render complete');
       });
       var tickMultiFormat = d3.time.format.multi([
           ["%-I:%M%p", function(d) { return d.getMinutes(); }], // not the beginning of the hour
           ["%-I%p", function(d) { return d.getHours(); }], // not midnight
           ["%b %-d", function(d) { return d.getDate() != 1; }], // not the first of the month
           ["%b %-d", function(d) { return d.getMonth(); }], // not Jan 1st
           ["%Y", function() { return true; }]
       ]);
       //chart3.xAxis.tickFormat(formatDateTick).axisLabel('Time');
       chart3.xAxis
       .tickPadding(10)
       .tickFormat(    
         function(d) {
        	 return tickMultiFormat(new Date(d));
        	 }
       ).axisLabel('Date');
     chart3.xScale(d3.time.scale());

       chart3.yAxis.tickFormat(d3.format('.02f')).axisLabel('Score');
       
       
       d3.select('#chart3 svg')
           .datum(chartdata3)
           .call(chart3);
       nv.utils.windowResize(chart3.update);
       chart3.dispatch.on('stateChange', function(e) { ('New State:', JSON.stringify(e)); });
       
       chart3.tooltip.enabled(false)
       return chart3;
   });


   socket.on('error', function(reason) {
	   console.eror(reason);
   });
   
   socket.on('chart3', function(value){
console.log("chart3 socket.on");
       var data= JSON.parse(value);
       
       var y = data.date.substr(0,4);
       var m = data.date.substr(4,2)-1;
       var d = data.date.substr(6,2);
       var date = new Date(y,m,d).getTime();
       

    		if ($("#ul-news").children().length>50) {
    			$( "#ul-news li:last-child" ).remove();
    		}
    		
    		var item = "<li><table><tr><td width='60' height='70'>";
    		
    		

    		if (data.type=='StockTwits') {
    			item = item+"<img src='/img/stocktwits.png' height='50'>";
    		} else if (data.type=='cnbc') {
    			item = item+"<img src='/img/cnbc.png' height='50'>";
    		}
    		item = item+"</td><td style='font-size:9pt'>[Score: "+data.score+"] "+data.title+"</td></tr></table></li>";
       
    		$( "#ul-news" ).first().prepend( item );
       
       if (data.score > 0) {
    	   		chartdata3[0].values.push({x:date,y:data.score,size:data.magnitude,sharp:'circle'})
       } else {
    	   		chartdata3[1].values.push({x:date,y:data.score,size:data.magnitude,sharp:'circle'})
       }
       if (chart3!=undefined) {
	       d3.select("#chart3 svg")
	       .datum(chartdata3)
	       .transition().duration(1200)
	       .call(chart3);
       }
   });
