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
    const [houseData, topoData] = values;
    
    let width = 900;
    let height = 600;

    let color_range = ["#D3E4F3", "#BDD8EC", "#A0CAE3", "#7EB8DA", "#5DA4D0", "#408EC4", "#1460A7", "#0A488D", "#08306B"];
    let domain = [d3.min(houseData, (d) => d.MedianValue), d3.max(houseData, (d) => d.MedianValue)]

    let colorScale = d3.scaleQuantile()
                    .domain(domain)
                    .range(color_range);

    console.log(colorScale(397820));


    let projection = d3.geoAlbersUsa().translate([width / 2, height / 2]).scale(1000);
    
    let path = d3.geoPath().projection(projection); 

    let svg = d3.select("#US-map")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

    let us_states = topojson.feature(topoData, topoData.objects.states).features;

    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(us_states)
        .enter()
        .append("path")
        .attr("id", d => {
            return d.properties.name
        })
        .attr("stroke", "#333")
        .attr("stroke-width", "1.5")
        .attr("fill", (d) => {
            return colorScale(d.properties.MedianValue);
        })
        .attr("d", path)
        .on("mouseover", function(d) {
            d3.select(this).attr("fill", "orange")
        })
        .on("mouseout", function(d) {
            return d3.select(this).attr("fill", d => colorScale(d.properties.MedianValue));
        })
}