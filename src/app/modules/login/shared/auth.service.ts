import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Authenticate } from 'src/app/models/security/Authenticate';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { BaseError } from 'src/app/models/common/errors/BaseError';
import { OtpCode } from 'src/app/models/security/OtpCode';
import { Tokens } from 'src/app/models/security/Tokens';
import { ChangePassword } from 'src/app/models/security/ChangePassword';
import { PasswordRecovery } from 'src/app/models/security/PasswordRecovery';
import { Credentials } from 'src/app/models/security/Credentials';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USER_STATE = '_USER_STATE';
  private readonly REMEMBER_ME = '_REMEMBER_ME';
  private readonly ACCESS_STATE = '_ACCESS_STATE';
  private readonly CURRENT_OFFICE = '_CURRENT_OFFICE';
  private readonly LAST_ROUTE = '_LAST_ROUTE';
  private readonly NAME_CURRENT_OFFICE = '_NAME_CURRENT_OFFICE';
  private readonly NAME_CURRENT_COMPANY = '_NAME_CURRENT_COMPANY';
  private readonly KPI_PERMISSIONS = '_KPI_PERMISSIONS';
  private loggedUser: string;
  private apiUrl = `${environment.API_BASE_URL_AUTHENTICATION}/Authentication`;

  constructor(public httpClient: HttpClient) { }

  get rememberMe() {
    return localStorage.getItem(this.REMEMBER_ME) === 'true';
  }

  get idUser() {
    return this.storeUser?.id ?? '';
  }

  get entityName() {
    return this.storeUser?.fullName ?? '';
  }

  get userName() {
    return this.storeUser?.email ?? '';
  }

  get jwt() {
    return this.storeUser?.token ?? '';
  }

  get userType() {
    return this.storeUser?.userType ?? '';
  }
  
  get storeUser() {
    if (this.rememberMe === true) {
      return JSON.parse(localStorage.getItem(this.USER_STATE));
    }
    return JSON.parse(sessionStorage.getItem(this.USER_STATE));
  }

  get currentOffice() {
    return JSON.parse(localStorage.getItem(this.CURRENT_OFFICE))?.idOffice ?? -1;
  }
  get currentNameOffice() {
    return JSON.parse(localStorage.getItem(this.NAME_CURRENT_OFFICE))?.nameOffice ?? '';
  }
  get currentNameCompany() {
    return JSON.parse(localStorage.getItem(this.NAME_CURRENT_COMPANY))?.nameCompany ?? '';
  }
  get currentCompany() {
    return JSON.parse(localStorage.getItem(this.CURRENT_OFFICE))?.idCompany ?? -1;
  }

  get lastRouteVisited() {
    return JSON.parse(sessionStorage.getItem(this.LAST_ROUTE))?.route ?? '';
  }

  get userImage() {
    return this.storeUser?.imageUrl ?? '';
  }

  get kpiPermissions() {
    return JSON.parse(localStorage.getItem(this.KPI_PERMISSIONS));
  }

  login(password:string, user: string, rememberMe: boolean): Promise<void> {
    const credentials: Credentials = {
      password: password,
      user: user,
      rememberme: rememberMe
    };
    
    return this.httpClient.post<Authenticate>(`${this.apiUrl}/Authenticate`, credentials)
      .toPromise()
      .then(token => {
        this.doLogin(credentials.user, {...token});
      });
  }

  logout() {
    return this.httpClient.post<any>(`${this.apiUrl}/LogOut`,
      {'refreshToken': this.getRefreshToken()}
    ).pipe(
      tap(() => this.doLogout()),
      mapTo(true),
      catchError(error => {
        throwError(error.error);
        return of(false);
      }));
  }

  isLoggedIn() {
    return !!this.getUserState();
  }

  getReadyLogin() {
    localStorage.removeItem(this.REMEMBER_ME);
    localStorage.removeItem(this.USER_STATE);
    localStorage.removeItem(this.ACCESS_STATE);
    localStorage.removeItem(this.CURRENT_OFFICE);
    localStorage.removeItem(this.NAME_CURRENT_OFFICE);
    localStorage.removeItem(this.NAME_CURRENT_COMPANY);
    localStorage.removeItem(this.KPI_PERMISSIONS);
    sessionStorage.removeItem(this.LAST_ROUTE);
  }

  refreshToken() {
    const token = this.getRefreshToken();
   return of(null).pipe(
      switchMap(() => {
        return this.httpClient.get<Tokens>(`${this.apiUrl}/refreshToken/${token}`).pipe(tap((tokens: Tokens) => {
          this.storeJwtToken(tokens.token, tokens.refreshToken);
        }), catchError((error)=> {return throwError(error);}));
      })
    );
  }

  getUserState(): {} {
    let userState: {};
    const localStorageTmp = JSON.parse(localStorage.getItem(this.USER_STATE));
    const sessionStorageTmp = JSON.parse(sessionStorage.getItem(this.USER_STATE));
    if (localStorageTmp !== null) {
      userState = localStorageTmp;
    } else {
      userState = sessionStorageTmp;
    }
    return userState;
  }

  generateOtpCode(otpCode: OtpCode) {
    console.log(`${otpCode.user} ${otpCode.receiveByEmail}`);
    return this.httpClient.post<any>
    (`${this.apiUrl}/GetOtpCode`, otpCode)
      .pipe(
        tap(response => {
            otpCode = {
                idUser: response.IdUser,
                otp: response.OTP
            };
            return otpCode;
        }), catchError((httpError: HttpErrorResponse) => {
          const errorBase: BaseError = {
            Code: httpError.status,
            ErrorMsg: httpError.error.message
          };
            return throwError(errorBase);
        })
      );
  }

  validateOtp(otpCode: OtpCode) {
    console.log(`${otpCode.idUser} ${otpCode.otp}`);
    return this.httpClient.post<boolean>
    (`${this.apiUrl}/VerifyOtp`, otpCode
    ).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((httpError: HttpErrorResponse) => {
          const errorBase: BaseError = {
            Code: httpError.status,
            ErrorMsg: httpError.error.error.message
          };
            return throwError(errorBase);
        })
    );
  }

  changePassword(userId: number, mainEmail: string, newPassword: string, password: string, userModified: number): Promise<boolean> {
    const changePassword: ChangePassword = {
      idUser: userId,
      mainEmail: mainEmail,
      newPassword: newPassword,
      password: password,
      userModified: userModified
    };
    return this.httpClient.post<boolean>(`${this.apiUrl}/UserPasswordChange`, changePassword)
      .toPromise();
  }

  recoveryPassword(userId: number, newPassword: string): Promise<boolean> {
    const passwordRecovery: PasswordRecovery = {
      id: userId,
      newPassword: newPassword
    };
    return this.httpClient.post<boolean>(`${this.apiUrl}/UserPasswordRecovery`, passwordRecovery)
      .toPromise();
  }

  removeUserStateFromStorage() {
    localStorage.removeItem(this.USER_STATE);
    sessionStorage.removeItem(this.USER_STATE);
  }

  updateRememberMe(bol: boolean) {
    localStorage[this.REMEMBER_ME] = JSON.stringify(bol);
  }

  updateCurrentOffice(idOffice: number, idCompany: number,nameCompany:string,nameOffice:string) {
    localStorage.setItem(this.CURRENT_OFFICE, JSON.stringify({ idOffice: idOffice, idCompany: idCompany}));
    localStorage.setItem(this.NAME_CURRENT_COMPANY, JSON.stringify({ nameCompany: nameCompany}));
    localStorage.setItem(this.NAME_CURRENT_OFFICE, JSON.stringify({ nameOffice: nameOffice}));
  }

  updateRouteVisited(route: string) {
    sessionStorage.setItem(this.LAST_ROUTE, JSON.stringify({route: route}));
  }

  removeRouteVisited() {
    sessionStorage.removeItem(this.LAST_ROUTE);
  }

  private doLogin(username: string, data: Authenticate) {
    this.loggedUser = username;
    this.storeTokens(data);
  }

  private doLogout() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private  getRefreshToken() {
    return JSON.parse(sessionStorage.getItem(this.USER_STATE))?.refreshToken ?? ''
  }

  public storeJwtToken(jwt: string, refreshToken: string) {
    var newUserStateTokens = JSON.parse(sessionStorage.getItem(this.USER_STATE));
    newUserStateTokens['refreshToken'] = refreshToken;
    newUserStateTokens['token'] = jwt;
    sessionStorage.setItem(this.USER_STATE, JSON.stringify(newUserStateTokens));
  }

  private storeTokens(data: Authenticate) {
    const item = {
      id: data.id,
      token: data.token,
      refreshToken: data.refreshToken,
      fullName: data.name + ' ' + data.lastName,
      email: data.email,
      imageUrl: data.imageUrl,
      userType: data.type
    };
    localStorage.setItem(this.REMEMBER_ME, JSON.stringify(data.rememberMe));

    if (data.rememberMe) {
      localStorage.removeItem(this.USER_STATE);
      localStorage.setItem(this.USER_STATE, JSON.stringify(item));
    } else {
      sessionStorage.removeItem(this.USER_STATE);
      sessionStorage.setItem(this.USER_STATE, JSON.stringify(item));
    }

  }

  private removeTokens() {
    if (this.rememberMe === true) {
      localStorage.removeItem(this.USER_STATE);
    } else {
      sessionStorage.removeItem(this.USER_STATE);
    }
    localStorage.removeItem(this.REMEMBER_ME);
  }
}
