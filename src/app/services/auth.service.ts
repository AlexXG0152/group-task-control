import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { shareReplay, tap, map } from 'rxjs/operators';

import moment from 'moment';

export interface ILoginForm {
  email: string;
  password: string;
}

export interface ISignupForm {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  employmentDate: string;
  firedDate?: string;
  role: string;
  organizationID: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(loginForm: ILoginForm) {
    return this.http
      .post<any>('/api/auth/login', {
        email: loginForm.email,
        password: loginForm.password,
      })
      .pipe(
        // tap((res) => this.setSession),
        // shareReplay()
        map((token) => {
          localStorage.setItem('id_token', token.accessToken);
          return token.accessToken;
        })
      );
  }

  signup(signupForm: ISignupForm) {
    return this.http
      .post<any>('/api/auth/signup', {
        email: signupForm.email,
        password: signupForm.password,
        firstname: signupForm.firstname,
        lastname: signupForm.lastname,
        employmentDate: signupForm.employmentDate,
        firedDate: signupForm.firedDate,
        role: signupForm.role,
        organizationID: signupForm.organizationID,
      })
      .pipe(
        // tap((res) => this.setSession),
        // shareReplay()
        map((token) => {
          localStorage.setItem('id_token', token.accessToken);
          return token.accessToken;
        })
      );
  }

  // private setSession(authResult: { expiresIn: any; token: string }) {
  //   const expiresAt = moment().add(authResult.expiresIn, 'second');

  //   localStorage.setItem('id_token', authResult.token);
  //   localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  // }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration!);
    return moment(expiresAt);
  }
}
