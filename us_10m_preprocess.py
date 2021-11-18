import json

us_10m_data = json.load(open('data/us-10m.json'))
county_name_data = json.load(open('data/county-names.json'))

def get_county_name(county_id):
    for id, county in county_name_data.items():
        if int(county_id) == int(id):
            return county

counties_geometry = us_10m_data['objects']['counties']['geometries']
for geo in counties_geometry:
    geo["properties"] = {
        'name': get_county_name(geo["id"]),
    }


json.dump(us_10m_data, open('data/us-10m.json', 'w'))