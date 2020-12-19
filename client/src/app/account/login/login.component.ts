import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForms: FormGroup;
  returnUrl: string;
  constructor(private accountService: AccountService,
              private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/shop';
    console.log('return url is ' + this.returnUrl);
    this.createLoginForms();
  }
  createLoginForms(): void {
    this.loginForms = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required])
      }
    );
  }
  submit(): void{
    this.accountService.login(this.loginForms.value).subscribe(() => {
      console.log('Logged in successfully sendint to shop');
      this.router.navigateByUrl(this.returnUrl);
    }, (err) => {
      console.error(err);
    });
  }
}
