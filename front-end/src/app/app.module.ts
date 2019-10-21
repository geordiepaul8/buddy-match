import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';




import { UserService } from './users/users.service';
import { InterestService } from './interests/interest-service';

import { NavbarComponent } from './navbar/navbar.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { UserProfileMatchesComponent } from './users/user-profile-matches/user-profile-matches.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';
import { UserListComponent } from './users/user-list/user-list.component';

import { InterestListComponent } from './interests/interest-list/interest-list.component';

@NgModule({
	declarations: [
		AppComponent,
		UserListComponent,
		NavbarComponent,
		UserProfileComponent,
		UserProfileMatchesComponent,
		UserRegisterComponent,
		InterestListComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule
	],
	providers: [UserService, InterestService],
	bootstrap: [AppComponent]
})
export class AppModule { }
