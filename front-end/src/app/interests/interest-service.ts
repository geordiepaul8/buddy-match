import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { Interest } from './interest.model';



@Injectable({
  providedIn: 'root',
})
export class InterestService {

  private getAllInterestsUrl = 'http://localhost:3000/v1/admin/interests/getAllInterests';

  constructor(private http: HttpClient) { }


  getAllInterests(): Observable<any> {
    return this.http.get<{message: string, interest: Array<Interest>}>
    (this.getAllInterestsUrl);
  }
};