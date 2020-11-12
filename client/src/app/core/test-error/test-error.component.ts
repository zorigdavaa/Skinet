import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {
  ValidationErrors: any;
  constructor(private http: HttpClient) { }
  baseUrl = environment.BaseUrlDevelopment;
  ngOnInit(): void {
  }
  get404Error(): void{
    this.http.get(this.baseUrl + 'products/44').subscribe(res => {
      console.log(res);
    }, err => {
      console.error(err);
    });
  }
  get500Error(): void{
    this.http.get(this.baseUrl + 'buggy/servererror').subscribe(res => {
      console.log(res);
    }, err => {
      console.error(err);
    });
  }
  getMathError(): void{
    this.http.get(this.baseUrl + 'buggy/maths').subscribe(res => {
      console.log(res);
    }, err => {
      console.error(err);
    });
  }
  get400Error(): void{
    this.http.get(this.baseUrl + 'buggy/badrequest').subscribe(res => {
      console.log(res);
    }, err => {
      console.error(err);
    });
  }
  get404ValidationError(): void{
    this.http.get(this.baseUrl + 'products/eleven').subscribe(res => {
      console.log(res);
    }, err => {
      console.error(err);
      this.ValidationErrors = err.errors;
    });
  }
}
