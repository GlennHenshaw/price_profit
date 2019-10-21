var max_width = 400;
var max_height = 250;

var total_width = Math.min(max_width,window.innerWidth);
var total_height = Math.min(max_height,window.innerHeight);

var svg = d3.select('#chart-area').append('svg')
            .attr("width",total_width)
            .attr("height",total_height);

var svg2 = d3.select('#chart-area2').append('svg')
            .attr("width",total_width)
            .attr("height",total_height)

var margin = {top:60,right:30,bottom:30,left:100};

var width = total_width - margin.left - margin.right;
var height = total_height - margin.top - margin.bottom;


var quant_price = svg.append('g')
               .attr("transform",
               	"translate("+margin.left+","+margin.bottom+")");

var price_profit = svg2.append('g')
                     .attr("transform", "translate("+margin.left+","+margin.bottom+")");

var x = d3.scaleLinear()
          .domain([0,10])
          .range([0,width]);

var y = d3.scaleLinear()
          .domain([100,1500])
          .range([height,0]);


var x_para = d3.scaleLinear()
          .domain([0,1500])
          .range([0,width]);

var y_para = d3.scaleLinear()
          .domain([0,100000])
          .range([height,0]);


var intercept = 1300;
var marginal = 200;
var fixed = 20;
var slope = (y(300) - intercept)/x(10);
var vertex = (intercept + marginal)/2;



var slider = d3
    .sliderHorizontal()
    .default(1300)
    .min(300)
    .max(1500)
    .step(100)
    .ticks(7)
    .width(200)
    .displayValue(true)
    .on('onchange', val => {
      d3.select('#intercept').text(val);
      intercept = val;
      slope = (y(300) - intercept)/x(10);
      vertex = (intercept + marginal)/2;
      draw_line(val);
    });

 

  d3.select('#slider_intercept')
    .append('svg')
    .attr('width', 300)
    .attr('height', 70)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(slider);


var marginal_slider = d3
    .sliderHorizontal()
    .default(200)
    .min(100)
    .max(500)
    .step(50)
    .ticks(5)
    .width(200)
    .displayValue(true)
    .on('onchange', val => {
      d3.select('#marginal_cost').text(val);
      marginal = val;
      vertex = (intercept + marginal)/2;
      draw_line(intercept);
    });

 

  d3.select('#slider_marginal_cost')
    .append('svg')
    .attr('width', 300)
    .attr('height', 70)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(marginal_slider);    


var fixed_slider = d3
    .sliderHorizontal()
    .default(20)
    .min(10)
    .max(50)
    .step(5)
    .ticks(5)
    .width(200)
    .displayValue(true)
    .on('onchange', v => {
      d3.select('#fixed_cost').text(v);
      fixed = v;
      draw_line(intercept);
    });

 

  d3.select('#slider_fixed_cost')
    .append('svg')
    .attr('width', 300)
    .attr('height', 70)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(fixed_slider);  


var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y).ticks(8);

var xAxis_price = d3.axisBottom(x_para);
var yAxis_profit = d3.axisLeft(y_para).ticks(8);


quant_price.append("g").call(yAxis);
quant_price.append("g").call(xAxis).attr("transform","translate("+0+","+height+")");

price_profit.append("g").call(yAxis_profit);
price_profit.append("g").call(xAxis_price).attr("transform","translate("+0+","+height+")");



price_profit.append("text")
            .attr("y", -20)
            .attr("x",x(5))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Price vs. Profit");

quant_price.append("text")
      .attr("y", -20)
      .attr("x",x(5))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Demand Curve");

quant_price.append("text")
      .attr("y", height/2)
      .attr("x",x(0)-margin.left/2 - 15)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Price ($)");

quant_price.append("text")
      .attr("y", height + 20)
      .attr("x",x(5))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Q (Quantity demanded in millionss)");

var line = quant_price.append("g")
                      .append("line")
                      .style("stroke", "steelblue")
                      .style("stroke-width","3");

function profit(p){
	//return (p/slope)*(p-intercept) - (marginal)*(p-intercept)/slope;
	return (1/slope)*p*p - p*((intercept+marginal)/slope) - fixed + (marginal*intercept)/slope;
}
draw_line(1300);                  

function draw_line(val){
	console.log(vertex);
	console.log(profit(vertex));
	//line.remove();
	
    price_profit.append("circle")
	        .attr("cx", x_para(vertex))
	        .attr("cy", y_para(profit(vertex)))
	        .attr("r",20);
	
    line.transition()
        .attr("x1", 0)     
        .attr("y1", y(val))      
        .attr("x2", x(10))     
        .attr("y2", y(300));  
}
