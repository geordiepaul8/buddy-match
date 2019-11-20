import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { User } from '../_models/user.model';

@Injectable({
		providedIn: 'root',
	})
export class UserService {

	private newUser: User;

	userSubject = new Subject<User>();
	

	private userUrl = 'http://localhost:3000/v1/user/getUser/';
	private userUrlQueryParams = '/?matches=true&interests=true';
	private addUserUrl = 'http://localhost:3000/v1/user/register';
	private deleteUserUrl = 'http://localhost:3000/v1/admin/user/deleteUser/';

	constructor(private http: HttpClient) { }


	getUserById(id: string): Observable<{message: string, user: User}> {
		console.log(`getting user by id: ${id}`)
		if(!id) {
			console.error(`id is blank!`)
			
		} 
		const url = `${this.userUrl}${id}${this.userUrlQueryParams}`;

		return this.http.get<{message: string, user: User}>(url);
	}

	getAllUsers(): Observable<{ message: string, users: User[] }> {
		return this.http.get<{ message: string, users: User[] }>
					('http://localhost:3000/v1/admin/user/getAllUsers');
	}

	registerUser(user: any): Observable<{message: string}> {
		console.log(`adding user from service: ${user.name}`)
	
		this.newUser = {
			_id: null,
			name: user.name,
			age: user.age, //this.userForm.value.age,
			loginCredentials: {
				email: user.email,
				password: user.password
			},
			loginMetrics: {
				isLoggedIn: false,
			},
			location: {
				latitude: user.location.latitude,
				longitude: user.location.longitude,
				city: user.location.city,
			},
			matches: [],
			interests: user.userInterests, //this.userForm.value.userInterests
			settings: {
				ageFilter: {
					isSet: false,
					min: -1,
					max: -1
				},
				searchDistance: 50
			}
		};

		return this.http.post<{message: string}>(this.addUserUrl, this.newUser);
	}


	deleteUser(userId: String) {
		return this.http.delete<{}>('http://localhost:3000/v1/admin/user/deleteUser/' + userId);
	}

	loggedInUser() {
		
	}
}
