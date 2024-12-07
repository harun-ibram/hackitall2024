import googlemaps
from datetime import datetime
## CONSTANTS
bucharest_coords = 44.4348, 26.1012

gmaps = googlemaps.Client(key="AIzaSyCJV0kxYAMwqQLXMpWetigJ1RglMqzYMo0")


mega_query = gmaps.places(query="Mega Image", location=bucharest_coords, radius=12000)
mega_list = mega_query["results"]

### GOOD things to have

park_list = [] # +++ park, rv_park
uni_list = [] # +++ university
entertainment_list = [] # +++ aquarium, amusement_park, museum, tourist_attraction, zoo
night_club_list = [] # +++ night_club
government_buildings_list = [] # +++ city_hall, courthouse, embassy, local_government_office, police, post_office
hospital_list = [] # hospital
gym_list = [] # gym
public_transport_list = [] # +++ bus_station, subway_station, light_rail_station, transit_station
school_list = [] # school, primary_school, secondary_school

### BAD Things to have

mall_list = [] # --- shopping_mall
other_store_list = [] # --- convenience_store, supermarket, liquor_store, pet_store(ensure they are different from a mega)

# for mega in mega_list:
# 	coord = mega["geometry"]["location"]["lat"], mega["geometry"]["location"]["lng"]
# 	parks_near_me_query = gmaps.places(location=coord, radius=500, type="park")
# 	parks_near_me = parks_near_me_query["results"]
# 	for park in parks_near_me:
# 		park_list.append(park)

# 	uni_near_me_query = gmaps.places(location=coord, radius=750, type="university")
# 	uni_near_me = uni_near_me_query["results"]
# 	uni_list.put(mega["place_id"], len(uni_near_me))

# 	entertainment = 0	
# 	## aquariums nearby
# 	aquarium_near_query = gmaps.places(location=coord, radius=500, type="aquarium")
# 	aquarium_near = aquarium_near_query["results"]
# 	entertainment = entertainment + len(aquarium_near)

# 	## amusement parks nearby
# 	amuse_near_query = gmaps.places(location=coord, radius=500, type="amusement_park")

# for park in park_list:
# 	print(park["place_id"])

print(len(mega_list))