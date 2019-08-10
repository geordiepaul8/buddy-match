import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileMatchesComponent } from './user-profile-matches.component';

describe('UserProfileMatchesComponent', () => {
  let component: UserProfileMatchesComponent;
  let fixture: ComponentFixture<UserProfileMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
