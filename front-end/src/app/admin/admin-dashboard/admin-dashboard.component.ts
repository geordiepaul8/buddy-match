import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/users.service';
import { InterestService } from 'src/app/_services/interest-service';
import { MatchesService } from 'src/app/_services/matches.service';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs';
import { Interest } from 'src/app/_models/interest.model';
import { Match } from 'src/app/_models/match.model';
import { AlertService } from 'src/app/_services/alert.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  interests: Interest[] = [];
  matches: Match[] = [];

  uid: String = "";

  filterMatch: Boolean = false;
  filterMatchByName: Boolean = false;
  filteredUser: String = '';

  constructor(
    private userService: UserService,
    private interestService: InterestService,
    private matchesService: MatchesService,
    private alertService: AlertService
  ) { }

  ngOnInit() {

    this.userService.getAllUsers()
      .subscribe(usersResponse => {
        this.users = usersResponse.users;

        console.log(`users: ${this.users.length}`);

        this.users.sort((a, b) => {
          return ((a.name.toUpperCase()) > (b.name.toUpperCase())) ? 1 : -1;
        });
      });


    this.interestService.getAllInterests()
      .subscribe(interestResponse => {
        this.interests = interestResponse.interest;

        console.log(`interests: ${this.interests.length}`);

        this.interests.sort((a, b) => {
          return ((a.category.toUpperCase()) > (b.category.toUpperCase())) ? 1 : -1;
        })
      });

    this.matchesService.getAllMatches()
      .subscribe(matchesResponse => {
        this.matches = matchesResponse.matches;

        console.log(`matches: ${this.matches.length}`);
        // console.log(this.matches[0])
      })

      // console.log(this.matches)
  }
  
  deleteInterest(interest: Interest) {
    let index = this.interests.indexOf(interest);

    console.log(`deleting interest: ${interest._id}`)

    this.interestService.deleteInterest(interest._id)
      .subscribe(deleteResponse => {

      })

    this.interests.splice(index, 1);
  }



  deleteUser(user: any) {
    console.log(`id of user to delete: ${user._id}`)

    // 1. remove the user from the users array
    this.users.splice(this.users.indexOf(user), 1);

    // 2. remove all the matches with the user 
    this.matches = this.matches.filter(m => !m.users.includes(user._id));

    // 3. - queue a job to remove the matches from the other users in the array - this is taken care of in the server

    this.userService.deleteUser(user._id)
    .subscribe(deleteResponse => {
      console.log(deleteResponse)
    });

    this.alertService.success(`User: ${user.name} [${user._id}] and ${user.matches.length} matches has been deleted.`)
  } // deleteUser

  filterMatches() {
    this.filterMatch = !this.filterMatch;

    if (this.filterMatch) {
      this.matches = this.matches.filter(m => m.compatibilityScore > 0);
    } else {
      this.clearFilterMatches();
    }
  }

  filterMatchByUser(user: any) {
    this.filterMatchByName = true;
    this.filteredUser = user._id;

    console.log(this.filteredUser)

    if (this.filterMatchByName) {
      this.matches = this.matches.filter(m => m.users.includes(user._id))
    } 
  }

  clearFilterMatches() {
    this.filterMatchByName = false;
    this.filteredUser = '';

    this.matchesService.getAllMatches()
    .subscribe(matchesResponse => {
      this.matches = matchesResponse.matches;

      console.log(`matches: ${this.matches.length}`);
    });
  }

  isDistanceWithinUserParams(distance: number, id: string): Boolean {
    // console.log(distance)
    // console.log(`id: ${id}`)
    // console.log(userDistance)
    // console.log(distance > userDistance)


    let user: User = this.users.filter(u => u._id === id)[0];

    // console.log(user)
    // console.log(`user: ${user.settings.searchDistance}`)

    return distance > user.settings.searchDistance ? false : true;
  }

}
