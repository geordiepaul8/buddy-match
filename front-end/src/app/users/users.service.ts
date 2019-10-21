import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { User } from './user.model';

@Injectable({
		providedIn: 'root',
	})
export class UserService {

	// private loggedInUser: User;

	private changedUser = new Subject<User>();
	loggedInUser = this.changedUser.asObservable();

	private userUrl = 'http://localhost:3000/v1/user/getUser/';
	private userUrlQueryParams = '/?matches=true&interests=true';
	private addUserUrl = 'http://localhost:3000/v1/user/addUser';

	constructor(private http: HttpClient) { }


	getUser(id: string) {
		const url = `${this.userUrl}${id}${this.userUrlQueryParams}`;

		return this.http.get<{message: string, user: User}>(url);
	}

	getAllUsers(): Observable<any> {

		return this.http.get<{message: string, users: Array<User>}>
					('http://localhost:3000/v1/admin/user/getAllUsers/?matches=true&interests=true');
	}

	registerUser(user: User) {
		return this.http.post<User>(this.addUserUrl, user);
	}

	changeLogInUser(user: User) {
		console.log(`logging in user: ${user.name}`);



		// this.newUserLogin.emit(user);
		this.changedUser.next(user);
	}

	changeLoginStatus(user: User) {
		console.log(`changing login status of user: ${user.name}: from: ${user.loginMetrics.isLoggedIn}`)
		return this.http.get<{message: string, loggedInStatus: boolean}>('http://localhost:3000/v1/user/setLogin/' + user._id + '/' + user.loginMetrics.isLoggedIn);
	}
}
