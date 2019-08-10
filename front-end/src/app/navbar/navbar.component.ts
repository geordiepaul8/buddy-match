import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../users/users.service';
import { User } from './../users/user.model';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

 loggedInUser: User;

	constructor(private userService: UserService) { }

	ngOnInit() {
		this.userService.loggedInUser
			.subscribe(loggedInUser => this.loggedInUser = loggedInUser);
	}

}
