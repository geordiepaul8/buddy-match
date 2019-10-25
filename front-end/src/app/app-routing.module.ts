import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';

import { InterestListComponent } from './interests/interest-list/interest-list.component';

import { LoginComponent } from './auth/login/login.component';

// each object represents a route
// on calling home, will redirect to the user-profile page
const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'user-profile/:id', component: UserProfileComponent },
	{ path: 'user-list', component: UserListComponent },
	{ path: 'user-register', component: UserRegisterComponent },
	{ path: 'all-interests', component: InterestListComponent },
	{ path: 'login', component: LoginComponent },
	{ path: '**', component: LoginComponent }
];

@NgModule({
	imports: [
		RouterModule.forRoot(
			routes,
		//	{ enableTracing: true } // debugging purposes only
			)
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
