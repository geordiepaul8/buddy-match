import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from '../_models/user.model';
import { UserService } from './users.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private token: string;

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private BASE_URL = "http://localhost:3000/v1"

    constructor(
        private http: HttpClient, 
        private userService: UserService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<{message: string, token: string, user: User}>(`${this.BASE_URL}/user/login`, { username, password })
            .pipe(map(response => {
                // login successful if there's a jwt token in the response
                if(response.token) {
                    this.token = response.token;
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                }
                return response.user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    getToken() {
        return this.token;
    }
}