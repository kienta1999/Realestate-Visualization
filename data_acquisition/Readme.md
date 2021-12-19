<h3>Data acquisition</h3>
<ul>
  Data source:
  <li><a href="https://simplemaps.com/data/us-zips">US Zipcode</a></li>
  <li>
    <a
      href="https://www.ers.usda.gov/data-products/county-level-data-sets/download-data/"
      >Poverty & Unemployment & Median Household Income & Education</a
    >
  </li>
  <li>
    <a href="https://www.redfin.com/">Hosuing price & information: Redfin</a>
  </li>
  <li>Crime Rate, Minimum Wage: Kaggle</li>
</ul>

<h3>Acquire data</h3>
<ul>
  <li>
    <i>data_preparation1.py</i>: acquire link to properties from Redfin from
    zipcode, randomly partition the link to 10 parts, and save the link to
    houses in cvs files in folder<i>data/property_href</i>
  </li>
  <li>
    data_preparation2.py: acquire specific housing information from the links,
    and save the raw data in csv files in flies
    <i>data/housing_data_raw/{index}.csv</i>
  </li>
  <li>
    data_preparation3.py: Preprocess the raw data and combine them with crime
    rate, minimum wage, and poverty rate, etc to generate final data in
    <i>data/final_data.csv</i>
  </li>
</ul>