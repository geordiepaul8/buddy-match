import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../users.service';

@Component({
	selector: 'app-user-register',
	templateUrl: './user-register.component.html',
	styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

	newUser: User;
	email: string;
	password: string;
	age: number;
	name: string;
	isLoggedIn: false;
	latitude: string;
	longitude: string;

	constructor(private userService: UserService) { }

	ngOnInit() {}

	registerNewUser(userForm) {

		console.log(userForm.value)

		this.newUser = {
			_id: null,
			name: userForm.value.name,
			age: userForm.value.age,
			loginCredentials: {
				email: userForm.value.email,
				password: userForm.value.password
			},
			loginMetrics: {
				isLoggedIn: userForm.value.isLoggedIn
			},
			location: {
				latitude: 123,
				longitude: 456,
				city: 'My City',
			},
			matches: [],
			interests: []
		};

		console.log(`New User:`);
		console.log(this.newUser);

		this.userService.registerUser(this.newUser)
		.subscribe((newUserResponse) => {
			console.log(newUserResponse);
		});
	}

}
