import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services/auth.service';
import { AlertService } from '../../_services/alert.service';
import { UserService } from '../../_services/users.service';
import { InterestService } from 'src/app/_services/interest-service';
import { Interest } from 'src/app/_models/interest.model';
import { LocationService } from 'src/app/_services/location.service';
import { Location } from './../../_models/location.model';

@Component({
    templateUrl: 'user-register.component.html',
    styleUrls: ['user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    interestList: Interest[] = [];
    locationList: Location[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private interestService: InterestService,
        private locationService: LocationService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            age: [null, [Validators.required, Validators.min(18)]],
            userInterests: new FormArray([]),
            location: [null, Validators.required]
        });

        this.interestService.getAllInterests()
		.subscribe((response) => {
			console.log(response)
			this.interestList = response.interest
        });
        
        this.locationService.getAllLocations()
            .subscribe(response => {
                console.log(response)
                this.locationList = response;
            })

        // this.registerForm.controls['location'].setValue(this.locationList[0], {onlySelf: true})
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onChangeInterest(interest: string, isChecked: boolean) {
		const interestFormArray = <FormArray>this.registerForm.controls.userInterests;

		if (isChecked) {
			interestFormArray.push(new FormControl(interest));
		} else {
			let index = interestFormArray.controls.findIndex(x => x.value == interest);
			interestFormArray.removeAt(index);
		}
	}

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        console.log(this.registerForm.value)

        this.loading = true;
        this.userService.registerUser(this.registerForm.value)
            .pipe(first())
            .subscribe(
                responseData => {
                    console.log(responseData)
                    this.alertService.success(responseData.message, true);
                    this.router.navigate(['/login']);
                },
                error => {
                    console.log(`there was an error`)
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
