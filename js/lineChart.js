function LineChart(state_name, state_median_prices){
    var self = this;
    self.state_name = state_name;
    self.state_median_prices = state_median_prices;
    self.state_median_prices.median_price.forEach(data => {
        data.price.forEach(d => {
            d.date = d3.timeParse("%Y-%m-%d")(d.date);
        });
    });
    
    self.init();
};

LineChart.prototype.init = function(){
    let self = this;
    self.margin = {top: 10, bottom: 30, left: 60, right:60};
    self.svgWidth = parseInt(d3.select('#line-chart').style('width')) - self.margin.left - self.margin.right;
    self.svgHeight = 400;

    var divLineChart = d3.select("#line-chart").html("");

    //creates svg element within the div
    self.svg = divLineChart.append("svg")
        .attr("width", self.svgWidth + self.margin.left + self.margin.right)
        .attr("height", self.svgHeight + self.margin.top + self.margin.bottom)
        .append("g")
		.attr("transform",`translate(${self.margin.left},${self.margin.top})`);

    self.displayLineChart();
};

LineChart.prototype.displayLineChart = function () {
	var self = this;

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

    let firstSelectedCity = cities_median_prices[0].city;
    let firstSelectedData = cities_median_prices[0].price;

    const xAxis = d3.scaleTime()
            .domain(d3.extent(firstSelectedData, (d) => d.date))
            .range([ 0, self.svgWidth ])

    self.svg.append("g")
        .attr("transform", `translate(0, ${self.svgHeight})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(xAxis))

    // Add Y axis
    const yAxis = d3.scaleLinear()
        .domain([0, d3.max(firstSelectedData, d => d.price)])
        .range([ self.svgHeight, 0 ])

    self.svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yAxis))

    // Add the line
    self.svg.append("path")
        .datum(firstSelectedData)
        .attr("fill", "none")
        .attr("class", "price-line")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
                .x(d => xAxis(d.date))
                .y(d => yAxis(d.price))
            )

    dropdown.on("change", (event) => {
        let selectedCity = dropdown.node().value;
        let selectedData = cities_median_prices.find(d => d.city === selectedCity).price;

        console.log(selectedCity);
        console.log(selectedData);

        self.svg.selectAll('.x-axis').remove();
        self.svg.selectAll('.y-axis').remove();
        self.svg.selectAll('.price-line').remove();

        const xAxis = d3.scaleTime()
            .domain(d3.extent(selectedData, (d) => d.date))
            .range([ 0, self.svgWidth ])

        self.svg.append("g")
            .attr("transform", `translate(0, ${self.svgHeight})`)
            .attr("class", "x-axis")
            .call(d3.axisBottom(xAxis))

        // Add Y axis
        const yAxis = d3.scaleLinear()
            .domain([0, d3.max(selectedData, d => d.price)])
            .range([ self.svgHeight, 0 ])

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
                    .x(d => xAxis(d.date))
                    .y(d => yAxis(d.price))
                )
    });
};