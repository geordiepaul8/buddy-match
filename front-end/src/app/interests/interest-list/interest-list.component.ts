import { Component, OnInit } from '@angular/core';

import { InterestService } from '../interest-service';

@Component({
  selector: 'app-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.css']
})
export class InterestListComponent implements OnInit {

  constructor(private interestService: InterestService) { }

  ngOnInit() {
    console.log('calling interest service');

    this.interestService.getAllInterests()
      .subscribe((allInterestsResponse) => {
        console.log(allInterestsResponse);
      });
  }

}
