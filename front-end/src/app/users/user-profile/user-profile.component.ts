import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { UserService } from '../users.service';

import { User } from './../user.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

private indexOfOwnUser: any;

	loggedInUser: User;
	private userId: string;

	userList: Array<User>;

	userMatchesList: Array<User>; // this is a list user details of the matches generated onInit
	private message: string;

	constructor(private userService: UserService, private route: ActivatedRoute) { }

	ngOnInit() {
		console.log(`url: ${this.route.snapshot.paramMap.get('id')}`);
		this.userId = this.route.snapshot.paramMap.get('id');


		console.log('calling get users');
		this.userService.getAllUsers()
		.subscribe((allUsersResponse) => {
			console.log(allUsersResponse);
			this.message = allUsersResponse.message;
			this.userList = allUsersResponse.users;


			// build an array of user profiles that match the user math array
			this.userMatchesList = this.userList.slice();

			this.indexOfOwnUser = this.userMatchesList.map((e) => {
				return e._id;
			}).indexOf(this.userId);

			console.log(`index of: ${this.indexOfOwnUser}`)

			if(this.indexOfOwnUser > -1) {
				this.userMatchesList.splice(this.indexOfOwnUser, 1);
			}

		});


		this.userService.getUser(this.userId)
		.subscribe((response) => {
			console.log(`get user response: ${response.message}`);
			console.log(response);
			this.loggedInUser = response.user;

	
		});


	

	}





}
