import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserService } from '../_services/users.service';
import { User } from '../_models/user.model';
import { AuthenticationService } from '../_services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit , OnDestroy{

 loggedInUser: User;

 currentUser: User;
 currentUserSubscription: Subscription;

	constructor(private userService: UserService,
		private router: Router,
		private authService: AuthenticationService) { }

	ngOnInit() {

		this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
			this.currentUser = user;
		});
	}

	logout() {
		console.log('logging out')
		this.authService.logout();
		this.router.navigate(['/login']);
	}


	ngOnDestroy() {
		this.currentUserSubscription.unsubscribe();
	}

}
