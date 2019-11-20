import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';

import { map } from 'rxjs/operators'

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit, OnDestroy {

  // private myObs$: Observable;

  private firstObsSubscription: Subscription;

  activatedEmitter = new Subject<boolean>();


  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
