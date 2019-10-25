import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
					('http://localhost:3000/v1/admin/user/getAllUsers');
	}

	registerUser(user: User) {
		console.log('adding user from service: ')
		console.log(user)
		return this.http.post<User>(this.addUserUrl, user);
	}

	changeLogInUser(user: User) {
		// console.log(`logging in user: ${user.name}`);

		// this.newUserLogin.emit(user);
		// this.changedUser.next(user);
	}

	changeLoginStatus(user: User) {
		return this.http.get<{message: string, loggedInStatus: boolean}>('http://localhost:3000/v1/user/setLogin/' + user._id + '/' + user.loginMetrics.isLoggedIn);
	}

	deleteUser(user: User) {
		return this.http.delete<{}>('http://localhost:3000/v1/admin/user/deleteUser/' + user._id);
	}
}
