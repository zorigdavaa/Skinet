import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/Models/User';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.BaseUrlDevelopment;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$: Observable<IUser> = this.currentUserSource.asObservable();
  constructor(private http: HttpClient, private router: Router) {}
  // getCurrentUserValue(): IUser {
  //   return this.currentUserSource.value;
  // }
  loadCurrentUser(token: string): Observable<void> {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(this.baseUrl + 'account', {headers})
    .pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }
  login(values: any): Observable<void> {
    return this.http.post(this.baseUrl + 'account/login', values)
    .pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      }),
      catchError(err => {
        throw err;
      })
    );
  }
  register(values: any): Observable<void> {
    return this.http.post(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          this.currentUserSource.next(user);
          localStorage.setItem('token', user.token);
        }
      }),
      catchError((err: any) => {
        throw err;
      })
    );
  }
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }
  checkEmailExists(email: string): Observable<object> {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }
}
