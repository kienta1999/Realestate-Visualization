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

    let cities_median_prices = self.state_median_prices.median_price;

    const dropdown = d3.select("#state_cities");
    dropdown.selectAll('.state_cities_option').remove();
    dropdown
        .selectAll(".state_cities_option")
        .data(cities_median_prices)
        .enter()
        .append("option")
        .classed("state_cities_option", true)
        .attr("value", (d) => d.city)
        .html((d) => d.city);

    dropdown.on("change", (event) => {
        let selectedCity = dropdown.node().value;
        let selectedData = cities_median_prices.find(d => d.city === selectedCity).price;

        selectedData.forEach(d => {
            d.date = d3.timeParse("%Y-%m-%d")(d.date);
        });

        console.log(selectedCity);
        console.log(selectedData);

        let xAxis = d3.scaleTime()
            .range([ 0, self.svgWidth ])
            .domain(d3.extent(selectedData, (d) => d.date))
            
        let yAxis = d3.scaleLinear()
            .range([ self.svgHeight, 30 ])
            .domain([0, d3.max(selectedData, (d) => d.price)])

        self.svg.selectAll('.x-axis').remove();
        self.svg.selectAll('.y-axis').remove();
        self.svg.selectAll('.price-line').remove();

        self.svg.append("g")
            .attr("transform", "translate(0," + self.svgHeight - 40 + ")")
            .attr("class", "x-axis")
            .call(d3.axisBottom(xAxis))

        self.svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yAxis))
      
        // Add the line
        self.svg.append("path")
            .datum(selectedData)
            .attr("fill", "none")
            .attr("class", "price-line")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return xAxis(d.date) })
                .y(function(d) { return yAxis(d.price) })
            )
    });
};