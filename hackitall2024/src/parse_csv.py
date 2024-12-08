import csv
from f_denspop import fit_model

class Mega:
    def __init__(self):
        self.ID = None
        self.long = None
        self.lat = None
        self.park = None
        self.uni = None
        self.entertainment = None
        self.night_club = None
        self.gov_building = None
        self.hospital = None
        self.gym = None
        self.public_transport = None
        self.school = None
        self.mall = None
        self.convenience_store = None
        self.supermarket = None
        self.liquor_store = None
        self.pet_store = None
        self.radius = None

    def from_csv(self, csv_file_path):
        with open(csv_file_path, mode='r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                self.ID = int(row['ID!'])
                self.long = int(row['long!'])
                self.lat = int(row['lat!'])
                self.park = int(row['park!'])
                self.uni = int(row['uni!'])
                self.entertainment = int(row['entertainment!'])
                self.night_club = int(row['night_club!'])
                self.gov_building = int(row['gov_building!'])
                self.hospital = int(row['hospital!'])
                self.gym = int(row['gym!'])
                self.public_transport = int(row['public_transport!'])
                self.school = int(row['school!'])
                self.mall = int(row['mall!'])
                self.convenience_store = int(row['convenience_store!'])
                self.supermarket = int(row['supermarket!'])
                self.liquor_store = int(row['liquor_store!'])
                self.pet_store = int(row['pet_store!'])
                break  # Assuming the CSV file has only one row for simplicity
            
    def create_radius(self):
        a, b, c = fit_model()
        bucharestDensity = 8260
        stores = self.convenience_store + self.supermarket
        + self.liquor_store + self.pet_store

        self.radius = (a / (bucharestDensity + b) + c) / 2
        self.radius -= self.uni * 5
        self.radius -= self.park * 1
        self.radius -= self.entertainment * 4
        self.radius -= self.night_club * 1
        self.radius -= self.gov_building * 0.5
        self.radius -= self.hospital * 0.5
        self.radius -= self.gym * 0.5
        self.radius -= self.public_transport * 0.5
        self.radius -= self.school * 2
        self.radius += self.mall * 20
        self.radius += stores * 10
        

# Example usage
if __name__ == "__main__":
    mega_instance = Mega()
    mega_instance.from_csv('test.csv')
    
    # Print the values to verify
    print(f"ID: {mega_instance.ID}")
    print(f"Longitude: {mega_instance.lat}")
    print(f"Latitude: {mega_instance.long}")
    print(f"Park: {mega_instance.park}")
    print(f"Uni: {mega_instance.uni}")
    print(f"Entertainment: {mega_instance.entertainment}")
    print(f"Night Club: {mega_instance.night_club}")
    print(f"Gov Building: {mega_instance.gov_building}")
    print(f"Hospital: {mega_instance.hospital}")
    print(f"Gym: {mega_instance.gym}")
    print(f"Public Transport: {mega_instance.public_transport}")
    print(f"School: {mega_instance.school}")
    print(f"Mall: {mega_instance.mall}")
    print(f"Convenience Store: {mega_instance.convenience_store}")
    print(f"Supermarket: {mega_instance.supermarket}")
    print(f"Liquor Store: {mega_instance.liquor_store}")
    print(f"Pet Store: {mega_instance.pet_store}")
    mega_instance.create_radius()
    print(f"Radius: {mega_instance.radius}")
    