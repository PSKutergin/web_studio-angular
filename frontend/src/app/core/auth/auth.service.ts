import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { LoginResponseType } from 'src/app/types/login-response.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';
  private isLogged: boolean = false;
  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject(this.isLogged);

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
    this.isLogged$.next(this.isLogged);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', { email, password, rememberMe });
  }

  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', { name, email, password });
  }

  logout(): Observable<DefaultResponseType> {
    const { refreshToken } = this.getTokens();
    if (refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', { refreshToken });
    }
    throw throwError(() => 'Refresh token is not found');
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const { refreshToken } = this.getTokens();
    if (refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', { refreshToken });
    }
    throw throwError(() => 'Refresh token is not found');
  }

  public getIsLoggedIn(): boolean {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return { accessToken: localStorage.getItem(this.accessTokenKey), refreshToken: localStorage.getItem(this.refreshTokenKey) };
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    id ? localStorage.setItem(this.userIdKey, id) : localStorage.removeItem(this.userIdKey);
  }
}
