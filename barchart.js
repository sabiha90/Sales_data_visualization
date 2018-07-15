function readData(x){
d3.csv("Visualizations.csv", function(data) {
	if(x=="month"){
		bar_sales_month(data);
	}else if (x=="year"){
		sales_by_year(data);

	} else if (x == "day"){
		sales_by_day(data);
	}
  else if (x == "category")
  {
    sales_by_category(data);
  }
  			
});
}
function read_Data_by_month(){
	readData("month");
}
function read_Data_year(){
	readData("year");
}

function read_Data_day(){
	readData("day");
}
function read_Data_cat(){
  readData("category");
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
function sales_by_day(csv_data){
var sales_day = d3.nest().key(function(d) { return (d.Day);})
  							  .rollup(function(d) { return d3.mean(d, function(g) {return g.Sales; });
  }).entries(csv_data);
    
    //sales_day = Math.ceil(sales_day);
    sales_day.sort(function(a,b){
    	return +a.key-(+b.key);
    });
    //return;
    bar_chart(sales_day,"Day");
 }

function sales_by_category(csv_data)
{
  var sales_cat = d3.nest().key(function(d) { return (d.Category_Name);})
                  .rollup(function(d) { return d3.mean(d, function(g) {return g.Sales; });
  }).entries(csv_data);

  sales_cat.sort(function(a,b){
      return a.key-(b.key);
    });

  donutChart(sales_cat);

}



function bar_chart(data_point,variable){
    var svg = d3.select("svg"),
    margin = {top: 100, right: 20, bottom: 40, left: 90},
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
      .on("mouseover", function(d){tooltip.text(Math.ceil(d.value * 100)/100); return tooltip.style("visibility", "visible");})
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


function donutChart(csv_data)
{
	
  var colors = ["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", 
    "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"];
	var margin = {top: 100, right: 20, bottom: 30, left: 90},
		width = 500 - margin.right - margin.left,
		height = 500 - margin.top - margin.bottom,
		radius = width/2;
	//arc generator
	var arc = d3.arc()
				.outerRadius(radius - 10)
				.innerRadius(0);

  var labelArc =  d3.arc()
                    .outerRadius(radius - 50)
                    .innerRadius(radius - 50);

  var pie = d3.pie()
              .value(function(d){ return d.value;});

  var svg = d3.select("svg"),
    margin = {top: 100, right: 20, bottom: 30, left: 90},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
    svg.selectAll("*").remove();

    //svg.attr("transform","translate("+width/2 + ","+height/2 +"}");

    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("fill","black")
    .style("background","white")
    .text("a simple tooltip");

    var g = svg.selectAll(".arc")
               .data(pie(csv_data))
               .enter().append("g")
               .attr("class","arc")
               .attr("transform","translate("+width/2 + ","+(height/2 + 80) +")")
               .on("mouseover", function(d){tooltip.text(Math.ceil(d.value * 100)/100); return tooltip.style("visibility", "visible");})
               .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
              .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
               ;


    g.append("path")
     .attr("d",arc)
     .style("fill",function(d,i){
        return colors[i%11];

     })
     .style("stroke","black")
     .style("stroke-width","1px")
     .attr("opacity",0)
     .transition()
     .duration(200)
            .delay(function(d,i){
              return i * 100;
            })
     .attr("opacity",1);



    g.append("text")
     .attr("transform",function(d){return "translate(" + labelArc.centroid(d) + ")" ;})
     .attr("dy",".35em")
     .text(function(d) { 
      console.log(d.data.key);
      return d.data.key;
    });




}



