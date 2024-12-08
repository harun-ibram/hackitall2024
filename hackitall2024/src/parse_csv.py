import csv
from f_denspop import fit_model

class Mega:
    def __init__(self):
        self.ID = None
        self.lng = None
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
        self.other_stores = None
        self.offices = None
        self.residential = None
        self.radius = None

    def create_radius(self):
        a, b, c = fit_model()
        bucharestDensity = 8260

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
        self.radius -= self.offices * 3
        self.radius -= self.residential * 2
        self.radius += self.mall * 20
        self.radius += self.other_stores * 10
        
    def from_csv(csv_file_path):
        mega_instances = []
        with open(csv_file_path, mode='r', newline='') as file:
            mega = Mega()
            reader = csv.DictReader(file)
            for row in reader:
                mega.ID = int(row['ID!'])
                mega.park = int(row['park!'])
                mega.uni = int(row['uni!'])
                mega.entertainment = int(row['entertainment!'])
                mega.night_club = int(row['night_club!'])
                mega.gov_building = int(row['gov_building!'])
                mega.hospital = int(row['hospital!'])
                mega.gym = int(row['gym!'])
                mega.public_transport = int(row['public_transport!'])
                mega.school = int(row['school!'])
                mega.mall = int(row['mall!'])
                mega.other_stores = int(row['other_stores!'])
                mega.offices = int(row['offices!'])
                mega.residential = int(row['residential!'])
                mega.lat = float(row['lat!'])
                mega.lng = float(row['lng!'])
                mega.create_radius()

                mega_instances.append((mega.lat, mega.lng, mega.radius))
                
        return mega_instances