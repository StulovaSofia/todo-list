import {Injectable} from '@angular/core';
import {AuthApiService} from '../api/auth-api.service';
import {StorageService} from './storage.service';
import {ILoginForm, ILoginResponse} from '../interfaces/login';
import {catchError, tap, throwError} from 'rxjs';

const API_TOKEN_KEY = 'API_TOKEN';
const API_TOKEN_CREATE_TIME = 'API_TOKEN_CREATE_TIME';
const TOKEN_TTL = 3600000; // one hour in ms
const SAFETY_INTERVAL = 180000; // 3 minutes in ms

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private authApiService: AuthApiService,
    private storageService: StorageService,
  ) {
    if (!this.storageService.exists(API_TOKEN_KEY) || this.tokenExpired()) {
      this.deleteToken();
    }
  }

  // presence of token with valid TTL means user logged in.
  get isLogged() {
    return !!this.token;
  }

  get token() {
    if (!this.storageService.exists(API_TOKEN_KEY)) {
      return '';
    }

    // if the token expired delete it from LocalStorage
    if (this.tokenExpired()) {
      this.deleteToken();
      return '';
    }

    return this.storageService.readItem(API_TOKEN_KEY) as string;
  }

  // this method is called by HttpIntreceptor to update token creation time on each API call
  updateTokenTTL() {
    this.storageService.saveItem(API_TOKEN_CREATE_TIME, `${Date.now()}`);
  }

  tokenExpired() {
    const tokenCreated = this.storageService.readItem(API_TOKEN_CREATE_TIME) || '';
    // assume token expired if TTL left is less 3 minutes
    const tokenAge = Date.now() - Number(tokenCreated);
    return tokenAge > (TOKEN_TTL - SAFETY_INTERVAL);
  }

  deleteToken() {
    this.storageService.deleteItem(API_TOKEN_KEY);
    this.storageService.deleteItem(API_TOKEN_CREATE_TIME);
  }

  login(loginData: ILoginForm) {
    return this.authApiService.login(loginData)
      .pipe(
        tap((resp: ILoginResponse) => {
          this.storageService.saveItem(API_TOKEN_KEY, resp.token);
          this.updateTokenTTL();
        }),
        catchError(() => {
          this.deleteToken();
          return throwError(() => new Error('ups something happened'));
        })
      );
  }
}
