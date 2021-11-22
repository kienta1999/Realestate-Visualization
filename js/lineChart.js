function LineChart(state_name, state_median_prices){
    let self = this;
    self.state_name = state_name;
    self.state_median_prices = state_median_prices;
    self.state_median_prices.median_price.forEach(data => {
        data.price.forEach(d => {
            d.dateTransformed = d3.timeParse("%Y-%m-%d")(d.date);
        });
    });
    
    self.init();
};

LineChart.prototype.init = function(){
    let self = this;
    self.margin = {top: 10, bottom: 30, left: 60, right:60};
    self.svgWidth = parseInt(d3.select('#line-chart').style('width')) - self.margin.left - self.margin.right;
    self.svgHeight = 400;

    let divLineChart = d3.select("#line-chart").html("");

    //creates svg element within the div
    self.svg = divLineChart.append("svg")
        .attr("width", self.svgWidth + self.margin.left + self.margin.right)
        .attr("height", self.svgHeight + self.margin.top + self.margin.bottom)
        .append("g")
		.attr("transform",`translate(${self.margin.left},${self.margin.top})`);

    self.displayLineChart();
};

LineChart.prototype.displayLineChart = function () {
	let self = this;

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

    self.drawLineChart(firstSelectedCity, firstSelectedData);

    dropdown.on("change", (event) => {
        let selectedCity = dropdown.node().value;
        let selectedData = cities_median_prices.find(d => d.city === selectedCity).price;

        self.svg.selectAll('.x-axis').remove();
        self.svg.selectAll('.y-axis').remove();
        self.svg.selectAll('.price-line').remove();
        self.svg.selectAll('.mouse-per-line').remove();
        self.svg.selectAll('.circle').remove();
        self.svg.selectAll('.mouse-per-line').remove();
        self.svg.selectAll('.text').remove();
        self.svg.selectAll('.mouse-line').remove();

        self.drawLineChart(selectedCity, selectedData);
    });
};

LineChart.prototype.drawLineChart = function(name, data) {
    let self = this;
    self.svg.append("text")
        .attr("x", 175)
        .attr("y", self.margin.top)
        .attr("dy", "0.1em")
        .style("text-anchor", "end")
        .text("Average Price ($)");

    // Add X axis
    const xAxis = d3.scaleTime()
            .domain(d3.extent(data, (d) => d.dateTransformed))
            .range([ 0, self.svgWidth ])

    self.svg.append("g")
        .attr("transform", `translate(0, ${self.svgHeight})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(xAxis))

    // Add Y axis
    const yAxis = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([ self.svgHeight, 0 ])

    self.svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yAxis))

    // Add the line
    self.svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line price-line")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
                .x(d => xAxis(d.dateTransformed))
                .y(d => yAxis(d.price))
            )

    let mouseG = self.svg.append("g")
        .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");
      
    let lines = document.getElementsByClassName('line');

    let mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(data)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 7)
        .attr('class', 'circle')
        .style("stroke", "gray")
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text")
        .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', self.svgWidth) // can't catch mouse events on a g element
        .attr('height', self.svgHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line").style("opacity", "0");
            d3.selectAll(".mouse-per-line circle").style("opacity", "0");
            d3.selectAll(".mouse-per-line text").style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line").style("opacity", "1");
            d3.selectAll(".mouse-per-line circle").style("opacity", "1");
            d3.selectAll(".mouse-per-line text").style("opacity", "1");
        })
        .on('mousemove', function() { // mouse moving over canvas
            let mouse = d3.mouse(this);
            d3.select(".mouse-line")
            .attr("d", function() {
                let d = "M" + mouse[0] + "," + self.svgHeight;
                d += " " + mouse[0] + "," + 0;
                return d;
            });

            d3.selectAll(".mouse-per-line").attr("transform", function(d, i) {
                let beginning = 0,
                    end = lines[i].getTotalLength(),
                    target = null;

                while (true){
                    target = Math.floor((beginning + end) / 2);
                    pos = lines[i].getPointAtLength(target);
                    if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                        break;
                    }
                    if (pos.x > mouse[0])
                        end = target;
                    else if (pos.x < mouse[0])
                        beginning = target;
                    else
                        break;
                }
                
                d3.select(this).select('text')
                    .text(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(yAxis.invert(pos.y).toFixed(2)));
                return "translate(" + mouse[0] + "," + pos.y +")";
            });
      });
}