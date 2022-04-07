
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, map, delay } from 'rxjs/operators';
import { Tokens } from '../models/security/Tokens';
import { AuthService } from '../modules/login/shared/auth.service';
import { LayoutService } from '../modules/layout/shared/layout.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private _authService: AuthService, 
    private _layoutService: LayoutService) {}


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.setUserInfo(request);
    request = this.setCors(request);
    this.logDebugRequest(request);
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse ) { this.logDebugResponse(event); }
        return event;
      }),
      catchError((error: Error) => {
        if(error instanceof HttpErrorResponse){
          switch(error.status) {
            case 401:
            return this.handle401Error(request, next)
            default:
            return throwError(error);
          }
        } else{
          return throwError(error);
        }
      }));
  }
  private setUserInfo(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        'idUser': `${this._authService.idUser}`,
        'Authorization': `Bearer ${this._authService.jwt}`
      }
    });
  }

  private setToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: { 'idUser': `${this._authService.idUser}`,'Authorization': `Bearer ${token}` }
    });
  }

  private setCors(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials': 'true',
        'Accept': '*/*'
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      return this.refreshToken(request, next) ;
    } else {
      return this.defaultTokenSubject(request, next); 
    }
  }
  
  private handle404Error(request: HttpRequest<any>, next: HttpHandler) {
    return request;
  }

  private doLogOut() {
    this._layoutService.removeStateAccessFromStorage();
    this._authService.removeUserStateFromStorage();
    window.location.replace('');
    alert("Su sesión ha expirado");
  }

  private logDebugRequest(request: HttpRequest<any>) {
    if (!environment.production) { console.log('request', request); }
  }

  private logDebugResponse(response: HttpResponse<any>) {
    if (!environment.production) { console.log('response', response); }
  }
  private refreshToken(request: HttpRequest<any>, next: HttpHandler) {
    this.isRefreshing = true;
    return this._authService.refreshToken().pipe( 
      switchMap((newToken: Tokens) => {
        if (newToken) { 
            this.storeNewToken(newToken);
            return next.handle(this.setToken(request, newToken.token));
          }
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    )
  }
  private defaultTokenSubject(request: HttpRequest<any>, next: HttpHandler) {
    return  this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => {
        return next.handle(this.setToken(request, jwt));
      }));
  }
  private storeNewToken(data){
    this.isRefreshing = false;
    this._authService.storeJwtToken(data.token, data.refreshToken);
    this.refreshTokenSubject.next(data.token);   
  }
  private handleError(error: HttpErrorResponse) {
    this.isRefreshing = false;
    this.doLogOut();
    return throwError(error);
  }
}
