import { Component, Input } from '@angular/core';
import { User } from './users/user.model';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'front-end';

	user: User;
	loggedInUser: string;

	setLoggedInUser(emittedUser) {
		// console.log('user: ' + loggedInUser);
		if (emittedUser) {
			this.user = emittedUser;
			this.loggedInUser = emittedUser.name;
		}

	}
}
