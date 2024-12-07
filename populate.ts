export class Mega {
	ID: number;
	park: number;
	uni: number;
	entertainment: number; 
	night_club: number;
	gov_building: number;
	hospital: number;
	gym: number;
	public_transport: number;
	school: number;
	mall: number;
	convenience_store: number;
	supermarket: number;
	liquor_store: number;
	pet_store: number;
	csvmaker(data: Mega) {
		let values = Object.values(data).join(',');
		let res = [...values];
		return res.join('\n');
	}
}


export function read_megas() {
	
}