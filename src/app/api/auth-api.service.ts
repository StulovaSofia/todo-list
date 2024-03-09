import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {ILoginForm} from '../interfaces/login';
import {API_SERVER} from '../utilities/api-server';

// Service sends request to API for user login.
@Injectable({
  providedIn: 'root',
})

export class AuthApiService {
  constructor(
    private httpClient: HttpClient,
    @Inject(API_SERVER) private apiServer: string,
  ) {
  }

  login(loginData: ILoginForm) {
    return this.httpClient.post(`${this.apiServer}/auth/login`, loginData);
  }
}
