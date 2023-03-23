import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { AuthService } from 'src/app/services/auth.service';

class CustomValidators {
  static passwordContainsNumber(control: AbstractControl) {
    const regex = /\d/;
    if (regex.test(control.value) && control.value !== null) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }
  static passwordMatch(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (
      (password === confirmPassword) &&
      (password !== null &&
      confirmPassword !== null)
    ) {
      return null
    } else {
      return { passwordsNotMatching: true };
    }
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  registerForm!: FormGroup;

  signup() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService
      .signup(this.registerForm.value)
      .pipe(map((token: string) => this.router.navigate(['/tasks'])))
      .subscribe();
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        firstname: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        employmentDate: [null, [Validators.required]],
        firedDate: [null],
        role: [null, [Validators.required]],
        organizationID: [null, [Validators.required]],
        email: [null, [Validators.required]],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            CustomValidators.passwordContainsNumber,
          ],
        ],
        confirmPassword: [null, [Validators.required]],
      },
      {
        validators: CustomValidators.passwordMatch,
      }
    );
  }
}
