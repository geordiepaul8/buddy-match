import { Component, OnInit, Output,  EventEmitter } from '@angular/core';
import { UserService } from './../users.service';

import { User } from './../user.model';


@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

	userList: Array<User>;
	message: string;
	
	@Output() newUserLogin = new EventEmitter<User>();

	constructor(private userService: UserService) { }

	ngOnInit() {
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
			console.log(response)
		});
		user.loginMetrics.isLoggedIn = !user.loginMetrics.isLoggedIn;
	}

	logInUser(user: User) {
		console.log(`calling service: ${user.name}`);
		this.userService.changeLogInUser(user)
	}

	

	deleteUser(user: User) {
		// remove the match id from the other users profile (front-end only)
		this.userList.forEach(u => {
			if (u._id !== user._id) {
				user.matches.forEach(m => {
					if(u.matches.includes(m)) {
						console.log(`remove match [${m}] from user: ${u._id} : ${u.name}`)
						let i = u.matches.indexOf(m);
						u.matches.splice(i, 1);
					}
				});
			}
		})

		console.log('calling delete user service')
		this.userService.deleteUser(user)
		.subscribe((response) => {
			console.log(response)
			this.userList.splice(this.userList.indexOf(user), 1);
		});
	}
}
