export class User {
	// tslint:disable-next-line:variable-name
	_id: string;
	name: string;
	age: number;
	interests: any;
	matches: any;
	location: Location;
	loginCredentials: LoginCredentials;
	loginMetrics: LoginMetrics;
	settings: Settings
}


class LoginCredentials {
	email: string;
	password: string;
}

class LoginMetrics {
	isLoggedIn: boolean;
}

class Location {
	latitude: number;
	longitude: number;
	city: string;
}

class Settings {
	ageFilter: AgeFilter;
	searchDistance: number;
}

class AgeFilter {
	isSet: boolean;
	min: number;
	max: number;
}
