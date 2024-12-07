import overpy
import folium
from geopy.geocoders import Nominatim

# Initialize the geocoder
geolocator = Nominatim(user_agent="bucharest_parks_locator")

# Get the coordinates of Bucharest
location = geolocator.geocode("Bucharest, Romania")
latitude = location.latitude
longitude = location.longitude

# Define a bounding box around Bucharest (latitude and longitude offsets)
lat_offset = 0.15
lon_offset = 0.15
south = latitude - lat_offset
north = latitude + lat_offset
west = longitude - lon_offset
east = longitude + lon_offset

api = overpy.Overpass()

# Query to search for all parks within the bounding box around Bucharest
query_find_stores = f"""
[out:json];
node["name"="Mega Image"]({south},{west},{north},{east});
out body;
"""

# Get the result of the query
result = api.query(query_find_stores)

# Create a map centered around Bucharest
map_bucharest = folium.Map(location=[latitude, longitude], zoom_start=12)

# Set to keep track of unique coordinates
unique_coords = set()

# Add nodes to the map
for node in result.nodes:
    lat_offset_Mega = 0.01;
    lon_offset_Mega = 0.01;
    # get the coordinates for each mega image
    lat = node.lat
    lon = node.lon
    # prepare the coordiantes in order
    # to search the type of buildings around it
    south = latitude - lat_offset_Mega
    north = latitude + lat_offset_Mega
    west = longitude - lon_offset_Mega
    east = longitude + lon_offset_Mega
    # TODO: query to find all building near the current mega
    # TODO: if it was not already marked, mark it
    query_find_parks_near_mega = f"""
    [out:json];
    node["leisrue"="park"]({south},{west},{north},{east});
    out body;
    """
    coords = (lat, lon)
    if coords not in unique_coords:
        unique_coords.add(coords)
        name = node.tags.get('name', 'N/A')
        folium.Marker(
            location=[lat, lon],
            popup=name,
            icon=folium.Icon(color='green', icon='info-sign')
        ).add_to(map_bucharest)

print(len(result.nodes))

# Save the map to an HTML file
map_bucharest.save("bucharest_parks_map.html")

print("Map has been created and saved as 'bucharest_parks_map.html'")