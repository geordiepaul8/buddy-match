import { Component, OnInit, Output,  EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { UserService } from '../../_services/users.service';
import { AuthenticationService } from '../../_services/auth.service';

import { User } from '../../_models/user.model';


@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

	userList: Array<User>;
	message: string;


	currentUser: User;
	currentUserSubscription: Subscription;
	users: User[] = [];
	
	@Output() newUserLogin = new EventEmitter<User>();

	constructor(
		private authenticationService: AuthenticationService,
		private userService: UserService
		) { 
			this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
				this.currentUser = user;
			});
		}

	ngOnInit() {
		this.loadAllUsers();
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.currentUserSubscription.unsubscribe();
	}

	private loadAllUsers() {
		this.userService.getAllUsers().pipe(first()).subscribe(response => {
			this.users = response.users;
		})
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
		this.userService.deleteUser(user._id)
		.subscribe((response) => {
			console.log(response)
			this.userList.splice(this.userList.indexOf(user), 1);
		});
	}
}
