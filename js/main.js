let us_map = document.getElementById("US-map");

let opts = {
    lines: 9,
    length: 9,
    width: 5, 
    radius: 14, 
    color: '#EE3124', 
    speed: 1.9,
    trail: 40,
    className: 'spinner',
};


var files = ["data/data.json"];

function init() {
    Promise.all([
        d3.json("data/median_home_price.json"),
        d3.json("data/us-10m.json"),
        d3.json("data/state_median_price.json"),
        d3.csv("data/final_data.csv"),
    ]).then(function (values) {
        let spinner = new Spinner(opts).spin(us_map);
        setTimeout(function() {
            spinner.stop();
            draw_map(values);
        }, 1200);
    });
   
};

init();

function myFunction() {
    myVar = setTimeout(showPage, 1500);
}
  
function showPage() {
    document.getElementById("legend").style.display = "block";
}

function draw_map(values) {
    const [houseData, topoData, stateMedianPriceData, houseListingData] = values;
    var margin = {top: 10, bottom: 10, left: 10, right:10},
        width = parseInt(d3.select('#US-map').style('width')) - margin.left - margin.right, 
        height = 550,
        active = d3.select(null);

    let color_range = ["#D3E4F3", "#BDD8EC", "#A0CAE3", "#7EB8DA", "#5DA4D0", "#408EC4", "#1460A7", "#0A488D", "#08306B"];
    let domain = [d3.min(houseData, (d) => d.MedianValue), d3.max(houseData, (d) => d.MedianValue)]

    let colorScale = d3.scaleQuantile()
                    .domain(domain)
                    .range(color_range);

    var svg = d3.select('#US-map').append('svg')
        .attr('class', 'center-container')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    svg.append('rect')
        .attr('class', 'background center-container')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .on('click', clicked);

    var projection = d3.geoAlbersUsa()
        .translate([width /2 , height / 2.5])
        .scale(width);

    var path = d3.geoPath()
        .projection(projection);

    var g = svg.append("g")
        .attr('class', 'center-container center-items us-state')
        .attr('transform', 'translate('+margin.left+','+margin.top+')')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    // ------------------------------ DRAW COUNTIES BOUNDARY ------------------------------
    let us_counties = topojson.feature(topoData, topoData.objects.counties).features;
    g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(us_counties)
        .enter().append("path")
        .attr("class", d => `county-boundary ${d.properties.name}`)
        .attr("stroke", "#333")
        .attr("stroke-width", "0.5px")
        .attr("fill", "rgb(255, 245, 245)")
        .attr("d", path)
        .on("click", reset);

    // ------------------------------ DRAW STATES BOUNDARY ------------------------------
    let us_states = topojson.feature(topoData, topoData.objects.states).features;

    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(us_states)
        .enter().append("path")
        .attr("class", d => `${d.properties.name}`)
        .attr("id", d => d.properties.MedianValue)
        .attr("stroke", "#333")
        .attr("fill", (d) => {
            return colorScale(d.properties.MedianValue);
        })
        .attr("d", path)
        .on("mouseover", function(d) {
            let name = d3.select(this).attr("class");
            let price = d3.select(this).attr("id").toString();

            d3.select(this).attr("fill", "#99dd99");
            svg.selectAll('.state_name').remove();
            svg.append('text')
                .attr('class','state_name')
                .attr("x", 20)
                .attr('y', height - 20)
                .text(name);

            svg.selectAll('.state_price').remove();
            svg.append('text')
                .attr('class','state_price')
                .attr("x", width / 2)
                .attr('y', height - 20)
                .text(`Median Home Value: $${price.substring(0,3)},${price.substring(3)}`);
        })
        .on("mouseout", function(d) {
            return d3.select(this).attr("fill", d => colorScale(d.properties.MedianValue));
        })
        .on("click", clicked);

    g.append("path")
        .datum(topojson.mesh(topoData, topoData.objects.states, function(a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", path);

    function clicked(d) {
        let name = d3.select(this).attr("class");
        let price = d3.select(this).attr("id").toString();

        svg.selectAll('.state_name').remove();
        svg.append('text')
            .attr('class','state_name')
            .attr("x", 20)
            .attr('y', height - 20)
            .text(name);

        svg.selectAll('.state_price').remove();
        svg.append('text')
            .attr('class','state_price')
            .attr("x", width / 2)
            .attr('y', height - 20)
            .text(`Median Home Value: $${price.substring(0,3)},${price.substring(3)}`);

        d3.select('#state-name-display')
            .text(name);
                
        if (d3.select('.background').node() === this) return reset();

        if (active.node() === this) return reset();

        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = .9 / Math.max(dx / width, dy / height),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        g.transition()
            .duration(750)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

        let state_median_prices = stateMedianPriceData.find(d => d.state === name);
        createLineChart(name, state_median_prices);
        createHouseListing(name, houseListingData);
    }

    function reset() {
        active.classed("active", false);
        active = d3.select(null);

        g.transition()
            .delay(100)
            .duration(750)
            .style("stroke-width", "1.5px")
            .attr('transform', 'translate('+margin.left+','+margin.top+')');
    }
}

function createLineChart(state_name, state_median_prices) {
    let lineChart = new LineChart(state_name, state_median_prices);
}

function createHouseListing(state_name, house_listing_data) {
    let houseListing = new HouseListing(state_name, house_listing_data);
}