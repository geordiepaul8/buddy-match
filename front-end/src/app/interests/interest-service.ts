import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { Interest } from './interest.model';



@Injectable({
  providedIn: 'root',
})
export class InterestService {

  private getAllInterestsUrl = 'http://localhost:3000/v1/admin/interests/getAllInterests';
  private addInterestUrl = 'http://localhost:3000/v1/interests/addInterest'


  constructor(private http: HttpClient) { }


  getAllInterests(): Observable<any> {
    return this.http.get<{message: string, interest: Array<Interest>}>
    (this.getAllInterestsUrl);
  }

  addInterest(interest: Interest) {
    return this.http.post<Interest>(this.addInterestUrl, interest);
  }
};