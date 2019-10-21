import { Component, OnInit, Output,  EventEmitter } from '@angular/core';
import { UserService } from './../users.service';


import { User } from './../user.model';
import { WebDriverLogger } from 'blocking-proxy/built/lib/webdriver_logger';

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

	userList: Array<User>;
	message: string;
	// loggedInUser: string;



	@Output() newUserLogin = new EventEmitter<User>();

	constructor(private userService: UserService) { }

	ngOnInit() {
		console.log('calling get users');
		this.userService.getAllUsers()
		.subscribe((allUsersResponse) => {
			console.log(allUsersResponse);
			this.message = allUsersResponse.message;
			this.userList = allUsersResponse.users;
			// make the first user back in the list the logged in user for now
			this.userService.changeLogInUser(allUsersResponse.users[0]);
		});
	}

	changeLoginStatus(user: User) {
		console.log(`calling login service: ${user.name}`);
	
		this.userService.changeLoginStatus(user)
		.subscribe((response) => {
			console.log(JSON.stringify(`response: ${response}`));
			console.log(response)

			
		});
		user.loginMetrics.isLoggedIn = !user.loginMetrics.isLoggedIn;
	}

	logInUser(user: User) {
		console.log(`calling service: ${user.name}`);
		this.userService.changeLogInUser(user)

	}



}
