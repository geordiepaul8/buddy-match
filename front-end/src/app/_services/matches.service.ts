import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Match } from '../_models/match.model';
import { Observable } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
		providedIn: 'root',
	})
export class MatchesService {

	private BASE_URL = 'http://localhost:3000/v1/matches/matchesForOneUser/'
	
	private allMatchesUrl = 'http://localhost:3000/v1/matches/allMatches';



	constructor(private http: HttpClient) { }


  getMatchesForUser(id: string) : Observable<{message: string, matches: Match[]}> {

		return this.http.get<{ message: string, matches: Match[]}>
					(this.BASE_URL + id)
					// .pipe(map(responseData => {
					// 	// sort the match array by highest (this will be the own profile)
					// 	responseData.matches =  responseData.matches
					// 					// .filter(o => o.compatibilityScore > 0)
					// 					.sort((a, b) => 
					// 						b.compatibilityScore - a.compatibilityScore
					// 					);

					// 					return responseData;
					// }))
	}
	

	getAllMatches() : Observable<{message: string, matches: Match[]}> {

		return this.http.get<{message: string, matches: Match[]}>
			(this.allMatchesUrl)
			// .pipe(map(responseData => {
			// 	responseData.matches = responseData.matches
			// 		.sort((a,b) => 
			// 			b.compatibilityScore - a.compatibilityScore
			// 		);

			// 		return responseData;
			// }))
	}


}
