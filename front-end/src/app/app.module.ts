import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserService } from './_services/users.service';
import { InterestService } from './_services/interest-service';
import { AuthenticationService } from './_services/auth.service';
import { AlertService } from './_services/alert.service';

import { NavbarComponent } from './navbar/navbar.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { UserProfileMatchesComponent } from './users/user-profile-matches/user-profile-matches.component';
// import { UserRegisterComponent } from './users/user-register/user-register.component';
import { UserRegisterComponent } from './auth/user-register/user-register.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { InterestListComponent } from './interests/interest-list/interest-list.component';
import { LoginComponent } from './auth/login/login.component';
import { InterestAddComponent } from './interests/interest-add/interest-add.component';
import { HomeComponent } from './home/home.component';
import { AlertComponent } from './_components/alert/alert.component';
import { AuthGuard } from './_guards/auth.guards';
import { AuthInterceptor } from './_interceptors/auth.interceptors';
import { ReactComponent } from './auth/react/react.component';
import { MatchesService } from './_services/matches.service';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

@NgModule({
	declarations: [
		AppComponent,
		UserListComponent,
		NavbarComponent,
		UserProfileComponent,
		UserProfileMatchesComponent,
		UserRegisterComponent,
		InterestListComponent,
		LoginComponent,
		InterestAddComponent,
		HomeComponent,
		AlertComponent,
		ReactComponent,
		AdminDashboardComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [
		UserService, 
		InterestService, 
		AuthenticationService, 
		AlertService,
		AuthGuard,
		MatchesService,
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
