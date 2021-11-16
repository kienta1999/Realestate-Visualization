function LineChart(state_name, state_median_prices){
    var self = this;
    self.state_name = state_name;
    self.state_median_prices = state_median_prices;
    self.init();
};

LineChart.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart from HTML
    var divLineChart = d3.select("#line-chart").html("");
    self.svgBounds = divLineChart.node().getBoundingClientRect();
    self.svgWidth = 400;
    self.svgHeight = 400;

    //creates svg element within the div
    self.svg = divLineChart.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)
        .append("g")
		.attr("transform","translate(0,0)");

    self.displayLineChart();
};

LineChart.prototype.displayLineChart = function () {
	var self = this;

    self.svg.selectAll('.state-name').remove();

    self.svg
        .append("text")
        .attr("class", "state-name")
        .attr("y", 20)
		.attr("x", 10)
		.text(self.state_name)

	console.log(self.state_name);
};