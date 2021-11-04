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

function draw_map(values) {
    const [houseData, topoData] = values;
    
    let width = 1000;
    let height = 600;

    let color_range = ["#CCE5FF", "#99ccff", "#66B2FF", "#3399FF", "#0080FF", "#0066CC"];
    let domain = [d3.min(houseData, (d) => d.MedianValue), d3.max(houseData, (d) => d.MedianValue)]

    let colorScale = d3.scaleQuantile()
                    .domain(domain)
                    .range(color_range);


    let projection = d3.geoAlbersUsa().translate([width / 2, height / 2]).scale(1250);
    
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
            return "#EEE";
        })
        .attr("d", path)
        .on("mouseover", function(d) {
            d3.select(this).attr("fill", "orange")
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("fill", "#eee")
        });
}