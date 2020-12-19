import { Component, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { off } from 'process';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.CreateRegisterForm();
  }
  private CreateRegisterForm(): void {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email], [this.validateEmailNotTaken()]],
      password: [null, [Validators.required]],
    });
  }

  submit(): void {
    console.log(this.registerForm.value);
    this.accountService.register(this.registerForm.value).subscribe(
      (response) => {
        this.router.navigateByUrl('/shop');
        console.log('registered user response is' + response);
      },
      (err) => {
        console.log(err);
        this.toastrService.error(err.errors, 'Error ' + err.statusCode);
      }
    );
  }
  validateEmailNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(1000).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value).pipe(
            map(res => {
              return res ? { emailExists : true } : null;
            })
          );
        })
      );
    };
  }
}
