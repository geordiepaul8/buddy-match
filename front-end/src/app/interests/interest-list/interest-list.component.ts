import { Component, OnInit } from '@angular/core';

import { InterestService } from '../../_services/interest-service';
import { Interest } from '../../_models/interest.model';

@Component({
  selector: 'app-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.css']
})
export class InterestListComponent implements OnInit {

  interestList: Array<Interest>

  constructor(private interestService: InterestService) { }

  ngOnInit() {
    console.log('calling interest service');

    this.interestService.getAllInterests()
      .subscribe((allInterestsResponse) => {
        console.log(allInterestsResponse);
        this.interestList = allInterestsResponse.interest;
      });
  }

}
