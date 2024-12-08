import networkx as nx
import matplotlib.pyplot as plt
from geopy.distance import geodesic
import pandas as pd

# Assuming 'data' is a pandas DataFrame with 'latitude' and 'longitude' columns
data = pd.read_csv('data.csv')

# # Create a graph
# G = nx.Graph()

# # Add edges with weights based on geodesic distance
# for i in range(len(data)):
#     for j in range(i + 1, len(data)):
#         node1 = (data.loc[i, 'latitude'], data.loc[i, 'longitude'])
#         node2 = (data.loc[j, 'latitude'], data.loc[j, 'longitude'])
#         distance = geodesic(node1, node2).kilometers
#         G.add_edge(i, j, weight=0)

# # Use the spring layout to position the nodes
# pos = nx.spring_layout(G)

# # Round the positions to 2 decimal places
# pos = {node: (round(coord[0], 2), round(coord[1], 2)) for node, coord in pos.items()}

# # Draw the graph with edge weights and node labels
# weights = nx.get_edge_attributes(G, 'weight')
# nx.draw(G, pos, with_labels=True, node_size=500, font_size=10, node_color='skyblue', edge_color='gray')

# # Draw edge labels
# nx.draw_networkx_edge_labels(G, pos, edge_labels=weights)

# # Save the graph to a file
# plt.savefig('/home/neho/Hack/hackitall2024/weighted_graph.png')
# # plt.show()
count = 0
for i in range(0, 600):
    for j in range(0, 600):
        for k in range(0, 600):
            count += 1
print(count)