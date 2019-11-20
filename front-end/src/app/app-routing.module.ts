import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { UserListComponent } from './users/user-list/user-list.component';
// import { UserRegisterComponent } from './users/user-register/user-register.component';
import { UserRegisterComponent } from './auth/user-register/user-register.component';

import { InterestListComponent } from './interests/interest-list/interest-list.component';

import { LoginComponent } from './auth/login/login.component';

import { AuthGuard } from './_guards/auth.guards';
import { HomeComponent } from './home/home.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

// each object represents a route
// on calling home, will redirect to the user-profile page
const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: UserRegisterComponent },
	{ path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
	{ path: 'admin-dashboard', component: AdminDashboardComponent },
	// { path: 'user-register', component: UserRegisterComponent },
	// { path: 'all-interests', component: InterestListComponent },
	
	{ path: '**', redirectTo: '' }
];

@NgModule({
	imports: [
		RouterModule.forRoot(
			routes,
			//{ enableTracing: true } // debugging purposes only
			)
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
