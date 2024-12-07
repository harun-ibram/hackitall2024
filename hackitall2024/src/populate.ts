import { convertArrayToCSV } from "convert-array-to-csv";
import * as fs from "fs";

export class Mega {
	ID!: number;
	park!: number;
	uni!: number;
	entertainment!: number; 
	night_club!: number;
	gov_building!: number;
	hospital!: number;
	gym!: number;
	public_transport!: number;
	school!: number;
	mall!: number;
	convenience_store!: number;
	supermarket!: number;
	liquor_store!: number;
	pet_store!: number;
	Mega() {
		this.ID = 0
		this.park = 0
		this.uni = 0
		this.entertainment = 0
		this.night_club = 0
		this.gov_building = 0
		this.hospital = 0
		this.gym = 0
		this.public_transport = 0
		this.school = 0
		this.mall = 0
		this.convenience_store = 0
		this.supermarket = 0
		this.liquor_store = 0
		this.pet_store = 0
	}
	csvmaker(data: Mega) {
		let values = Object.values(data).join(',')
		let res = [...values]
		return res.join('\n')
	}
}

interface Place {
	name: string,
	location: google.maps.LatLng
}


const searchNearby = (type: string) => {
	
}

export function read_megas() {
	let array: Mega[] = []
	array = [...array, ]
	let whatever = convertArrayToCSV(array, {
		header: ["ID",
		"Parks",
		"Universities",
		"entertainment",
		"night_clubs",
		"gov_buildings",
		"hospitals",
		"gyms",
		"public_transport",
		"schools",
		"malls",
		"convenience_stores",
		"supermarkets",
		"liquor_stores",
		"pet_stores",
	], separator: ','})
	fs.writeFile("output.csv", whatever, _ => {})
}