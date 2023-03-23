import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface IToken {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  static accessToken = '';
  refresh = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      request.url.indexOf('login') > -1 ||
      request.url.indexOf('some_another_route_with_no_auth_header_added') > -1
    ) {
      return next.handle(request);
    }

    const isTokenExists = localStorage.getItem(environment.JWT_A_TOKEN_NAME);
    if (!isTokenExists) {
      this.router.navigate(['/login']);
      return next.handle(request);
    }

    const isTokenExpired = this.jwtHelper.isTokenExpired(
      localStorage.getItem(environment.JWT_A_TOKEN_NAME)
    );

    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem(
          environment.JWT_R_TOKEN_NAME
        )}`,
      },
    });

    if (!isTokenExpired) {
      return next.handle(request);
    } else {
      return next.handle(req).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401 && !this.refresh) {
            return this.http
              .post('api/auth/refresh', {}, { withCredentials: true })
              .pipe(
                switchMap((res: any) => {
                  HttpRequestInterceptor.accessToken = res.accessToken;
                  localStorage.setItem(
                    environment.JWT_A_TOKEN_NAME,
                    res.accessToken
                  );
                  localStorage.setItem(
                    environment.JWT_R_TOKEN_NAME,
                    res.refreshToken
                  );

                  return next.handle(
                    request.clone({
                      setHeaders: {
                        Authorization: `Bearer ${HttpRequestInterceptor.accessToken}`,
                      },
                    })
                  );
                })
              );
          }

          this.refresh = false;
          this.router.navigate(['/']);

          return throwError(() => err);
        })
      );
    }
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
