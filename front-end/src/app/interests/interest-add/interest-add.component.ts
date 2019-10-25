import { Component, OnInit } from '@angular/core';
import { Interest } from '../interest.model';
import { InterestService } from '../interest-service';

@Component({
  selector: 'app-interest-add',
  templateUrl: './interest-add.component.html',
  styleUrls: ['./interest-add.component.css']
})
export class InterestAddComponent implements OnInit {

  newInterest: Interest;

  constructor(private interestService: InterestService) { }

  ngOnInit() {
  }

  registerNewInterest(interestForm) {
    console.log(interestForm);

    this.newInterest = {
      _id: null,
      category: interestForm.value.interestCategory,
      name: interestForm.value.interestName
    }

    this.interestService.addInterest(this.newInterest)
    .subscribe(response => {
      // we need to send the response to the parent
      console.log(`add interest resoponse`)
      console.log(response)
    })
  }

}
