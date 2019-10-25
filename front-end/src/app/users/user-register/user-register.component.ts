import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../users.service';
import { InterestService } from 'src/app/interests/interest-service';
import { Interest } from 'src/app/interests/interest.model';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
	selector: 'app-user-register',
	templateUrl: './user-register.component.html',
	styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

	newUser: User;
	// email: string;
	password: string;
	age: number;
	name: string;
	isLoggedIn: false;
	latitude: string;
	longitude: string;

userForm: FormGroup;
email: FormControl;
	

	interestList: Array<Interest>;

	constructor(private userService: UserService, 
							private interestService: InterestService,
							private fb: FormBuilder) { 



	}

	ngOnInit() {
		// call the interests

		this.interestService.getAllInterests()
		.subscribe((response) => {
			console.log(response)
			this.interestList = response.interest
		});

		// this.userForm = this.fb.group({
		// 	userInterests: this.fb.array([])
		// })

		this.userForm = new FormGroup({
			email: new FormControl(''),
			name: new FormControl(''),
			age: new FormControl(''),
			latitude: new FormControl(''),
			longitude: new FormControl(''),
			password: new FormControl(''),
			userInterests: new FormArray([])
		});
	}

	onChangeInterest(interest: string, isChecked: boolean) {
		const interestFormArray = <FormArray>this.userForm.controls.userInterests;

		if (isChecked) {
			interestFormArray.push(new FormControl(interest));
		} else {
			let index = interestFormArray.controls.findIndex(x => x.value == interest);
			interestFormArray.removeAt(index);
		}

		console.log(interestFormArray)
	}

	addUser() {

console.log('add user')
		console.log(this.userForm)

		this.newUser = {
			_id: null,
			name: this.userForm.value.name,
			age: this.userForm.value.age,
			loginCredentials: {
				email: this.userForm.value.email,
				password: this.userForm.value.password
			},
			loginMetrics: {
				isLoggedIn: this.userForm.value.isLoggedIn
			},
			location: {
				latitude: this.userForm.value.latitude,
				longitude: this.userForm.value.longitude,
				city: 'My City',
			},
			matches: [],
			interests: this.userForm.value.userInterests
		}

		console.log(this.newUser)

		this.userService.registerUser(this.newUser)
		.subscribe((newUserResponse) => {
			console.log(newUserResponse);
		});

	}


	// depricated
	registerNewUser(userForm) {

		console.log(userForm.value)

		this.newUser = {
			_id: null,
			name: userForm.value.name,
			age: userForm.value.age,
			loginCredentials: {
				email: userForm.value.email,
				password: userForm.value.password
			},
			loginMetrics: {
				isLoggedIn: userForm.value.isLoggedIn
			},
			location: {
				latitude: 123,
				longitude: 456,
				city: 'My City',
			},
			matches: [],
			interests: []
		};

		console.log(`New User:`);
		console.log(this.newUser);

		this.userService.registerUser(this.newUser)
		.subscribe((newUserResponse) => {
			console.log(newUserResponse);
		});
	}

}
