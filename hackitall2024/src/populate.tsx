import { convertArrayToCSV } from "convert-array-to-csv";
import { read } from "fs";
const fs = require("fs")

export class Mega {
	scores!: LocationScores
	lat!: number
	lng!: number
	id!: string
	csvmaker(data: Mega) {
		let values = Object.values(data).join(',')
		let res = [...values]
		return res.join('\n')
	}
}

interface Place {
	name: string
	location: Coordinates
	types: string[]
	id: string
}

type LocationScores = {
  park: number;
  uni: number;
  entertainment: number;
  nightClub: number;
  govBuild: number;
  hospital: number;
  gymList: number;
  publicTransport: number;
  schools: number;
  malls: number;
  offices: number;
  otherStores: number;
  residential: number;
}

type Coordinates = {
	latitude: number,
	longitude: number
}

type Circle = {
	center: Coordinates,
	radius: number
}

type Rectangle = {
	low: Coordinates,
	high: Coordinates
}
type Bias = {
	rectangle?: Rectangle,
	circle?: Circle
}
type Query = {
	textQuery: string,
	locationBias: Bias,
	strictTypeFiltering?: boolean,
	typeIncluded?: string
	pageToken?:string
}

type NearbySearch = {
	locationRestriction: {
		circle: Circle
	},
	includedTypes: string[],
}

const placeTypes: string[] = [
  "gas_station", // other
  "rest_stop", // entertainment
  "corporate_office", // office
  "art_gallery", // entertainment
  "cultural_landmark", // entertainment
  "historical_place", // entertainment
  "monument", // entertainment
  "museum", // entertainment
  "sculpture", // entertainment
  "library", // school
  "preschool", // school
  "primary_school", // school
  "school", // school
  "secondary_school", // school
  "university", // university
  "apartment_building", // residential
  "apartment_complex", // residential
  "condominium_complex", // residential
  "housing_complex", // residential
  "asian_grocery_store", // other
  "butcher_shop", // other
  "convenience_store", // other
  "food_store", // other
  "grocery_store", // other
  "liquor_store", // other
  "market", // other
  "pet_store", // other
  "shopping_mall", // malls
  "supermarket", // other
  "wholesaler", // other
  "city_hall", // gov 
  "courthouse", // gov
  "embassy", // gov 
  "fire_station", // gov 
  "government_office", // gov 
  "local_government_office", // gov 
  "police", // gov 
  "post_office", // gov 
  "bagel_shop", // other
  "bakery", // other
  "candy_store", // other
  "ice_cream_shop", // other
  "juice_shop", // other
  "sandwich_shop", // other
]

// return a LocationScores for the specified coordinates
export async function fetch_scores(lat: number, lng:number) {
	const url = "https://places.googleapis.com/v1/places:searchNearby/"
	const text_url = "https://places.googleapis.com/v1/places:searchText/"
	let req_body: NearbySearch = {
		locationRestriction: {
			circle:{
				center: {
					latitude: lat,
					longitude: lng
				},
				radius: 500.0
			}
		},
		includedTypes: placeTypes,
	}
	let textbody: Query = {
		locationBias: {
			circle: {
				center: {
					latitude: 44.4348,
					longitude: 26.1012
				},
				radius: 12000
			}
		},
		textQuery: "Mega Image",

	}
	console.log(JSON.stringify(req_body))
	const response = await fetch(text_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Goog-Api-Key": "AIzaSyCJV0kxYAMwqQLXMpWetigJ1RglMqzYMo0",
			"X-Goog-FieldMask": "*",
		},
		body: JSON.stringify(textbody)
	})
	const data = await response.json()
	console.log(data.places)
	const places = data.places	
	let scores: LocationScores = {
		park: 0, 
		uni: 0,
		entertainment: 0,
		nightClub: 0,
		govBuild: 0,
		hospital: 0,
		gymList: 0,
		publicTransport: 0, 
		schools: 0,
		malls: 0,
		otherStores: 0,
		residential: 0,
		offices: 0
	}
	for (let place of places) {
		let types:string[] = place.types
		if (
			types.includes("park") ||
			types.includes("rv_park")
		) scores.park++
		else if (
			types.includes("university")
		) scores.uni++
		else if (
			types.includes("aquarium") ||
			types.includes("amusement_park") ||
			types.includes("museum") ||
			types.includes("tourist_attraction") ||
			types.includes("zoo") ||
			types.includes("rest_stop") ||
			types.includes("art_gallery") ||
			types.includes("cultural_landmark") ||
			types.includes("historical_place") ||
			types.includes("monument") ||
			types.includes("sculpture")
		) scores.entertainment++
		else if (
			types.includes("library") ||
			types.includes("preschool") ||
			types.includes("school") ||
			types.includes("secondary_school")
		) scores.schools++
		else if ((
			types.includes("asian_grocery_store") || 
			types.includes("butcher_shop") ||
			types.includes("convenience_store") ||
			types.includes("food_store") ||
			types.includes("grocery_store") ||
			types.includes("liquor_store") ||
			types.includes("market") ||
			types.includes("pet_store") ||
			types.includes("supermarket") ||
			types.includes("bagel_shop") ||
			types.includes("bakery") ||
			types.includes("candy_store") ||
			types.includes("ice_cream_shop") ||
			types.includes("juice_shop") ||
			types.includes("sandwich_shop")
		) && place.displayName.text.indexOf("Mega Image") == -1 && place.displayName.text.indexOf("Shop&Go") == -1
		) scores.otherStores++
		else if (
			types.includes("corporate_office")
		) scores.offices++
		else if (
			types.includes("city_hall") ||
			types.includes("courthouse") ||
			types.includes("embassy") ||
			types.includes("fire_station") ||
			types.includes("government_office") ||
			types.includes("local_government_office") ||
			types.includes("police") ||
			types.includes("post_office")
		) scores.govBuild++
		else if (
			types.includes("shopping_mall")
		) scores.malls++
		else if (
			types.includes("apartment_building") ||
			types.includes("apartment_complex") ||
			types.includes("condominium_complex") ||
			types.includes("housing_complex")
		) scores.residential++
	}
	return scores

}

// Returns a list of Mega items within the city
export async function search_for_megas() {
	let res:Place[] = []
	let token:string|undefined
	const text_url = "https://places.googleapis.com/v1/places:searchText/"

	do {
		let textbody: Query = {
			locationBias: {
				circle: {
					center: {
						latitude: 44.4348,
						longitude: 26.1012
					},
					radius: 12000
				}
			},
			textQuery: "Mega Image",
			pageToken: token
		}
		const response = await fetch(text_url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": "AIzaSyCJV0kxYAMwqQLXMpWetigJ1RglMqzYMo0",
				"X-Goog-FieldMask": "*",
			},
			body: JSON.stringify(textbody)
		})
		const data = await response.json()
		const places = data.places
		for (let place of places) {
			let add: Place = {
				name: place.displayName,
				id: place.place_id,
				location: {
					latitude: place.location.lat,
					longitude: place.location.lng
				},
				types: place.types,
			}
			res =[...res, add]
		}
		token = data.nextPageToken
	} while (token && res.length < 500)
	do {
		let textbody: Query = {
			locationBias: {
				circle: {
					center: {
						latitude: 44.4348,
						longitude: 26.1012
					},
					radius: 12000
				}
			},
			textQuery: "Shop&Go",
			pageToken: token
		}
		const response = await fetch(text_url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": "AIzaSyCJV0kxYAMwqQLXMpWetigJ1RglMqzYMo0",
				"X-Goog-FieldMask": "*",
			},
			body: JSON.stringify(textbody)
		})
		const data = await response.json()
		const places = data.places
		for (let place of places) {
			let add: Place = {
				name: place.displayName,
				id: place.place_id,
				location: {
					latitude: place.location.lat,
					longitude: place.location.lng
				},
				types: place.types,
			}
			res = [...res, add]
		}
		token = data.nextPageToken
	} while (token && res.length < 500)
	let locations: Mega[] = []
	for (let place of res) {
		let murr: Mega= {
			scores: await fetch_scores(place.location.latitude, place.location.longitude),
			lat: place.location.latitude,
			lng: place.location.longitude,
			id: place.id,
			csvmaker: function (data: Mega): string {
				let values = [
					data.id,
					data.scores.park,
					data.scores.uni,
					data.scores.entertainment,
					data.scores.nightClub,
					data.scores.govBuild,
					data.scores.hospital,
					data.scores.gymList,
					data.scores.publicTransport,
					data.scores.schools,
					data.scores.malls,
					data.scores.otherStores,
					data.scores.offices,
					data.scores.residential,
					data.lat,
					data.lng
				].join(',')
				let all = [...values, data.lat, data.lng].join(",")
				let res = [...all]
				return res.join('\n')
			}
		}
		locations= [...locations, murr]
	}
	console.log(locations)
	return locations
}

// Write the mega parameters to 'output.csv'
export async function write_megas() {
	let megas: Mega[] = await search_for_megas()
	let write: string = ""
	for (let m of megas) {
		write = [...write, m.csvmaker(m)].join("\n")
	}
	let header = [...[
		"ID",
		"parks",
		"universities",
		"entertainment",
		"night_clubs",
		"gov_buildings",
		"hospitals",
		"gyms",
		"public_transport",
		"schools",
		"malls",
		"other_stores",
		"offices",
		"residential",
		"lat",
		"lng"
	].join(",")]
	write = [...header, write].join("\n")

	fs.writeFile("output.csv", write, 'utf8', (err: any) => {
		console.error(err)
	})
}