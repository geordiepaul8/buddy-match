import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';


import { UserListComponent } from './users/user-list/user-list.component';
import { UserService } from './users/users.service';
import { NavbarComponent } from './navbar/navbar.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { UserProfileMatchesComponent } from './users/user-profile-matches/user-profile-matches.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';

@NgModule({
	declarations: [
		AppComponent,
		UserListComponent,
		NavbarComponent,
		UserProfileComponent,
		UserProfileMatchesComponent,
		UserRegisterComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule
	],
	providers: [UserService],
	bootstrap: [AppComponent]
})
export class AppModule { }
