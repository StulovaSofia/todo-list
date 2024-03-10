import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {API_SERVER} from '../utilities/api-server';
import {ITask, ITasks} from '../interfaces/task';
import {StorageService} from '../service/storage.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  constructor(public storageService: StorageService,
              public http: HttpClient,
              @Inject(API_SERVER) private apiServer: string) {
  }

  addTask(task: ITask) {
    return this.http.post(`${this.apiServer}/todos/add`, task,
      {headers: new HttpHeaders({'Authorization': `Bearer ${this.storageService.readItem('API_TOKEN')}`})}) as Observable<ITask>;
  }

  getTasks(userId: number) {
    return this.http.get(`${this.apiServer}/todos/user/${userId}`,
      {headers: new HttpHeaders({'Authorization': `Bearer ${this.storageService.readItem('API_TOKEN')}`})}) as Observable<ITasks>;
  }

  deleteTask(taskId: string) {
    return this.http.delete(`${this.apiServer}/todos/${taskId}`,
      {headers: new HttpHeaders({'Authorization': `Bearer ${this.storageService.readItem('API_TOKEN')}`})})
  }

  changeStatus(taskId: string, completed: boolean) {
    return this.http.put(`${this.apiServer}/todos/${taskId}`, {completed: !completed},
      {headers: new HttpHeaders({'Authorization': `Bearer ${this.storageService.readItem('API_TOKEN')}`})});
  }

  changeTitleTask(taskId: string, todo: string) {
    return this.http.put(`${this.apiServer}/todos/${taskId}`, {todo},
      {headers: new HttpHeaders({'Authorization': `Bearer ${this.storageService.readItem('API_TOKEN')}`})});
  }
}
