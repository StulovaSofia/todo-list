import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from '../service/storage.service';
import {API_SERVER} from "../utilities/api-server";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  constructor(public storageService: StorageService,
              public http: HttpClient,
              @Inject(API_SERVER) private apiServer: string) {
  }

  getUser() {
    return this.http.get(`${this.apiServer}/auth/me`,
      {headers: new HttpHeaders({'Authorization': `Bearer ${this.storageService.readItem('API_TOKEN')}`})})
  }
}
