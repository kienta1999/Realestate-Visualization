function abbrState(input, to){
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }    
    }
}

function HouseListing(state_name, house_listing_data){
    let self = this;
    self.state_name = state_name;
    self.state_abbr = abbrState(self.state_name, 'abbr');

    self.house_listing_data = house_listing_data.filter(d => d.state === self.state_abbr);
    self.page = 1;
    self.page_size = 15;
    
    self.init();
    d3.select("#previous-btn").on("click", () => {
        if(self.page == 1){
            return;
        }
        self.page -= 1;
        d3.select("#page-number").text(self.page);
        self.init();
    });

    d3.select("#next-btn").on("click", () => {
        if((self.page + 1) * self.page_size >= self.house_listing_data.length){
            return;
        }
        self.page += 1;
        d3.select("#page-number").text(self.page);
        self.init();
    });

};

HouseListing.prototype.init = function(){
    let self = this;
    d3.select("#page-number").text(self.page);
    d3.select('#house-page').classed("hidden", false);

    for (let i = 0; i < self.page_size; i++) {
        let j = i + (self.page - 1) * self.page_size;
        let housediv = d3.select(`#house${i+1}`).html("");
        let margin = {top: 10, bottom: 10, left: 10, right:10};
        let svgWidth = parseInt(d3.select(`#house${i+1}`).style('width')) - margin.left - margin.right;
        let svgHeight = 250;

        let housei = self.house_listing_data[j];

        let svg = housediv.append("svg")
            .attr("width", svgWidth + margin.left + margin.right)
            .attr("height", svgHeight + margin.top + margin.bottom);

        svg.append("svg:image")
            .attr('x', -60)
            .attr('y', 0)
            .attr('width', "100%")
            .attr('height', "150")
            .attr("xlink:href", housei.img_href.split(" ")[0])

        svg.append("text")
            .attr("x", 0)
            .attr("y", 150 + 10*2.5)
            .style("font-size", "1em")
            .attr("fill", "steel")
            .attr("font-weight", "bolder")
            .style("text-anchor", "start")
            .text(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(housei.price));

        svg.append("text")
            .attr("x", 0)
            .attr("y", 150 + 10*5)
            .style("font-size", "0.9em")
            .attr("fill", "steelBlue")
            .style("text-anchor", "start")
            .text(housei.stress_address);
    
        svg.append("text")
            .attr("x", 0)
            .attr("y", 150 + 10*7)
            .style("font-size", "0.9em")
            .attr("fill", "steelBlue")
            .style("text-anchor", "start")
            .text(`${housei.city}, ${housei.state} ${housei.zip}`);

        svg.append("text")
            .attr("x", 0)
            .attr("y", 150 + 10*9.5)
            .style("font-size", "0.7em")
            .attr("fill", "gray")
            .style("text-anchor", "start")
            .text(`${housei.beds} bed(s), ${housei.bath} bath(s)`);
        
        housediv.classed("house", true)
                .on("click", () => {
                    console.log("clicked", housei);
                    d3.select("#house-detail").classed("hidden", false);
                    d3.select('#box_price').html(`Price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(housei.price)}`)
                    d3.select('#box_address').html(`Address: ${housei.stress_address}, ${housei.city}, ${housei.state} ${housei.zip}`)
                    d3.select('#box_area').html(`Area: ${housei.area} sqft - Year Built: ${housei.year_built}`)
                    d3.select('#box_bedbath').html(`${housei.beds} bed(s), ${housei.bath} bath(s)`)
                    d3.select('#box_walkscore').html(`Walk Score: ${housei.walk_score}/100, Bike Score: ${housei.bike_score}/100, Transit Score: ${housei.transit_score}/100`)
                    d3.select('#expand_img1').attr("src", housei.img_href.split(" ")[0]);
                    d3.select('#expand_img2').attr("src", housei.img_href.split(" ")[1]);
                    d3.select('#box_min_wage').html(`Minimum wage in ${abbrState(housei.state, 'name')}: $${housei.minimum_wage}/hour`)
                    d3.select('#box_income').html(`Median household income in ${housei.county}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(housei.median_household_income)}`)
                    d3.select('#box_unemployment').html(`Unemployment rate in ${housei.county}: ${housei.unemployment_rate}`)
                    d3.select('#box_crime_rate').html(`Crime rate per 100k people: ${housei.crime_rate_per_100000}`)
                })
    }
};

d3.select("#close-house-detail").on("click", () => {
    d3.select("#house-detail").classed("hidden", true);
})