function readData(x){
d3.csv("Visualizations.csv", function(data) {
	if(x=="month"){
		bar_sales_month(data);
	}else if (x=="year"){
		sales_by_year(data);

	}
  			
});
}
function read_Data_by_month(){
	readData("month");
}
function read_Data_year(){
	readData("year");
}
function bar_sales_month(csv_data){
//d3.csv("Visualizations.csv", function(csv_data) {
	//console.log(csv_data);
   var sales_month = d3.nest().key(function(d) { return (d.Month);})
  							  .rollup(function(d) { return d3.mean(d, function(g) {return g.Sales; });
  }).entries(csv_data);
    
    //console.log(sales_month);
    sales_month.sort(function(a,b){
    	return +a.key-(+b.key);
    });
    //return;
    bar_chart(sales_month,"Month");
 }


function sales_by_year(csv_data){
var sales_year = d3.nest().key(function(d) { return (d.Year);})
  							  .rollup(function(d) { return d3.mean(d, function(g) {return g.Sales; });
  }).entries(csv_data);
    
    //console.log(sales_month);
    sales_year.sort(function(a,b){
    	return +a.key-(+b.key);
    });
    //return;
    bar_chart(sales_year,"Year");
 }






function bar_chart(data_point,variable){
    var svg = d3.select("svg"),
    margin = {top: 100, right: 20, bottom: 30, left: 90},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    	y = d3.scaleLinear().rangeRound([height, 0]);
    svg.selectAll("*").remove();
	var g = svg.append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  	x.domain(data_point.map(function(d) { return d.key; }));
  	y.domain([0, d3.max(data_point, function(d) { return d.value; })]);

  	g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x",width/2)
      .attr("y",30)
      .style("fill","black")
      .text(variable);

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(12))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x",-height/2)
      .attr("y", -50)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .style("fill","black")
      .text("Sales");

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("fill","black")
    .style("background","white")
    .text("a simple tooltip");

  g.selectAll(".bar")
    .data(data_point)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      //.attr("y", function(d) { return y(d.value); })
      .attr("y",height)
      .attr("width", x.bandwidth())
      .attr("height",0)
      .on("mouseover", function(d){tooltip.text(d.value); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      .transition()
            .duration(200)
            .delay(function(d,i){
            	return i * 50;
            })
       .attr("height", function(d) { return height - y(d.value); })
       .attr("y", function(d) { return y(d.value); })
       
      
}


