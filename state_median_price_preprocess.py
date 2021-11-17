import pandas as pd
import json

data = pd.read_csv('data/state_median_price.csv')
# house_price = data[data.columns[5:]]
# print(house_price.loc[0])

states = set()
for state in data['StateName']:
    if not pd.isna(state):
        states.add(state)
json_states = []
for state in states:
    house_price_per_state = data[data['StateName'] == state]
    json_state = {}
    json_state['state'] = state
    json_state['median_price'] = []
    for i in range(house_price_per_state.shape[0]):
        house_price_per_city = house_price_per_state.iloc[i]
        prices = []
        for date in data.columns[5:]:
            if not pd.isna(house_price_per_city[date]):
                prices.append({
                    'date': date,
                    'price': house_price_per_city[date]
                })
        json_state['median_price'].append({
            'city': house_price_per_city['RegionName'].split(', ')[0],
            'price': prices
        })
    json_states.append(json_state)

with open("data/state_median_price.json", "w") as outfile:
    json.dump(json_states, outfile)
