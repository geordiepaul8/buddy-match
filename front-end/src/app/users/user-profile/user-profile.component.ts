import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';


import { UserService } from '../../_services/users.service';

import { User } from '../../_models/user.model';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { MatchesService } from 'src/app/_services/matches.service';

import { Match } from 'src/app/_models/match.model';
import { first, map } from 'rxjs/operators';
import { InterestService } from 'src/app/_services/interest-service';
import { Interest } from 'src/app/_models/interest.model';
import { AlertService } from 'src/app/_services/alert.service';


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

	currentUser: User;
	currentUserSubscription: Subscription;

	// this will be determined by matching the user to themselves, this gives their total score weigthin
	// and then used to determine the maximum compatibility % (thus we can hide the scoring)
	maxMatchScore: number; 

	numFullMatch: number;


	userList: User[] = [];

	interestList: Interest[] = [];

	filteredUserMatchesList: any;
	userMatchesList: any; // this is a list user details of the matches generated onInit


	constructor(
		private userService: UserService, 
		private router: Router,
		private authService: AuthenticationService,
		private matchesService: MatchesService,
		private interestService: InterestService,
		private alertService: AlertService
	) {
		this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
			this.currentUser = user;
			// console.log(this.currentUser)
		});
	 }

	ngOnInit() {

		this.numFullMatch = 0;

		// get the match which corresponds to the user id

		this.matchesService.getMatchesForUser(this.currentUser._id)
			.subscribe(matchModel => {
				// 1. filter the 0 scores from the list

				matchModel.matches = matchModel.matches.filter(m => m.compatibilityScore > 0);

				//set the max compat score
				this.maxMatchScore = matchModel.matches[0].compatibilityScore;

				// matchModel.matches.shift();

				this.filteredUserMatchesList = matchModel.matches;


				this.numFullMatch = this.countTopMatches(this.filteredUserMatchesList);

				console.log(this.numFullMatch)

				this.alertService.success(matchModel.message);




			}, error => {

				console.log(error)
				this.alertService.error(error);
				// this.router.navigate(['/login']);
			});


		this.interestService.getAllInterests()
		.subscribe(interestResponse => {
			this.interestList = interestResponse.interest;
			
		})


		this.userService.getAllUsers()
			.pipe(first()).subscribe(response => {
				this.userList = response.users;
			});
		
	}


	removeInterest(id: string) {
		console.log(`removing interest: ${id}`);

		this.interestService.deleteInterest(id)
		.subscribe(response => {
			console.log(response)
			this.alertService.success(response.message)

			// this.currentUser.interests.pop();

			this.userService.getUserById(this.currentUser._id)
			.subscribe( userResponse => {
				this.currentUser = userResponse.user;
			})

		})
	}

	/*
	*	takes the match array and counts the # of 100% matches the user has
	*/
	countTopMatches(matchArray: Match[]) : number {
		console.log(this.maxMatchScore)
		
		console.log(matchArray.filter(e => {
			((e.compatibilityScore / this.maxMatchScore) * 100) === 100
		}))
		
		return matchArray.filter(e => {
			((e.compatibilityScore / this.maxMatchScore) * 100) === 100
		}).length
	}
}
