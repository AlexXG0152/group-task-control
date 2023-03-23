import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

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
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

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
          localStorage.setItem(environment.JWT_A_TOKEN_NAME, token.accessToken);
          localStorage.setItem(
            environment.JWT_R_TOKEN_NAME,
            token.refreshToken
          );
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
          localStorage.setItem(environment.JWT_A_TOKEN_NAME, token.accessToken);
          localStorage.setItem(
            environment.JWT_R_TOKEN_NAME,
            token.refreshToken
          );
          return token.accessToken;
        })
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(environment.JWT_A_TOKEN_NAME);
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem(environment.JWT_A_TOKEN_NAME);
    localStorage.removeItem(environment.JWT_R_TOKEN_NAME);
    this.router.navigate(['/']);
  }
}
// refreshToken() {
//   const headers = new HttpHeaders().set(
//     'Authorization',
//     `Bearer ${localStorage.getItem(environment.JWT_R_TOKEN_NAME)}`
//   );

//   console.log('refreshToken from authservice');

// //   return this.http.post(`/api/auth/refresh`, {}, { headers });
// // }

// // return this.http.post(`/auth/refresh`, headers).pipe(
// //   map((token: any) => {
// //     localStorage.setItem(environment.JWT_A_TOKEN_NAME, token.accessToken);
// //     return token;
// //   })
// // );
// }

// private setSession(authResult: { expiresIn: any; token: string }) {
//   const expiresAt = moment().add(authResult.expiresIn, 'second');

//   localStorage.setItem('id_token', authResult.token);
//   localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
// }

// public isLoggedIn() {
//   return moment().isBefore(this.getExpiration());
// }

// isLoggedOut() {
//   return !this.isLoggedIn();
// }

// getExpiration() {
//   const expiration = localStorage.getItem('expires_at');
//   const expiresAt = JSON.parse(expiration!);
//   return moment(expiresAt);
// }
