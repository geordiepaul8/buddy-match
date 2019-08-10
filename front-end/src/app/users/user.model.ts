export class User {
	// tslint:disable-next-line:variable-name
	_id: string;
	name: string;
	age: number;
	interests: any;
	matches: any;
	location: Location;
	loginCredentials: LoginCredentials;
}


class LoginCredentials {
	email: string;
	password: string;
}

class Location {
	latitude: number;
	longitude: number;
	city: string;
}
