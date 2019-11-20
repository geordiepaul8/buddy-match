import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from './auth.service';
import { Location } from './../_models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  private getAllLocationsUrl  = 'http://localhost:3000/v1/locations/allLocations'

  constructor(private http: HttpClient, 
              private authService: AuthenticationService ) { 
    
  }

  getAllLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.getAllLocationsUrl)
      .pipe(map(responseData => {

          // responseData = responseData
          //   .sort((a, b) => b.city - a.city);

        return responseData;
      }));
  }

}
