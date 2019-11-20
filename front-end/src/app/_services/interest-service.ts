import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';


import { Interest } from '../_models/interest.model';
import { User } from '../_models/user.model';
import { AuthenticationService } from './auth.service';



@Injectable({
  providedIn: 'root',
})
export class InterestService {

  currentUser: User;
	currentUserSubscription: Subscription;

  private getAllInterestsUrl  = 'http://localhost:3000/v1/interests/getAllInterests';
  private addInterestUrl      = 'http://localhost:3000/v1/interests/addInterest'
  private removeInterestUrl   = 'http://localhost:3000/v1/admin/interests/deleteInterest';


  constructor(private http: HttpClient, private authService: AuthenticationService ) { 
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
			this.currentUser = user;
			// console.log(this.currentUser)
		});
  }

  getAllInterests(): Observable<{message: string, interest: Interest[]}> {
    return this.http.get<{message: string, interest: Interest[]}>
    (this.getAllInterestsUrl);
  }

  addInterest(interest: Interest): Observable<Interest> {
    return this.http.post<Interest>(this.addInterestUrl, interest);
  }

  // router.patch('/deleteInterest/:userId/:interestId'
  deleteInterestFromUser(interestId: string): Observable<{message: string}> {
    return this.http.patch<{message: string}>
      (this.removeInterestUrl + '/' + this.currentUser._id + '/' + interestId,
      {});
  }

  deleteInterest(interestId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>
      (this.removeInterestUrl + '/' + interestId,
      {});
  }
};
