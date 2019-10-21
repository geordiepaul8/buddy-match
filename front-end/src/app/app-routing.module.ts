import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';

import { InterestListComponent } from './interests/interest-list/interest-list.component';

// each object represents a route
// on calling home, will redirect to the user-profile page
const routes: Routes = [
	{ path: '', redirectTo: '/user-list', pathMatch: 'full' },
	{ path: 'user-profile/:id', component: UserProfileComponent },
	{ path: 'user-list', component: UserListComponent },
	{ path: 'user-register', component: UserRegisterComponent },
	{ path: 'all-interests', component: InterestListComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
