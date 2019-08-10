import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { UserService } from '../users.service';

import { User } from './../user.model';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

	loggedInUser: User;
	private userId: string;

	constructor(private userService: UserService, private route: ActivatedRoute) { }

	ngOnInit() {
		console.log(`url: ${this.route.snapshot.paramMap.get('id')}`);
		this.userId = this.route.snapshot.paramMap.get('id');
		this.userService.getUser(this.userId)
		.subscribe((response) => {
			console.log(`get user response: ${response.message}`);
			console.log(response);
			this.loggedInUser = response.user;
		});

	}





}
