import {Injectable} from '@angular/core';
import {catchError, Observable, of, Subject, tap} from 'rxjs';
import {TaskApiService} from '../api/task-api.service';
import {ITask, ITasks} from '../interfaces/task';
import {NotificationService} from './notification.service';
import {StorageService} from "./storage.service";

enum TaskStatus {
  'statusChanged',
  'titleChanged',
  'deleted'
}

@Injectable({
  providedIn: 'root'
})
export class ProxyService {

  public proxyTasksUpdate: Subject<ITasks> = new Subject<ITasks>();

  private readonly tasksKey: string = 'tasks';
  private isOffline = false;
  private changedTasks = new Map<ITask, TaskStatus>();

  constructor(
    public taskApiService: TaskApiService,
    public notificationService: NotificationService,
    public storageService: StorageService) {
  }

  get offline() {
    return this.isOffline;
  }

  set offline(value: boolean) {
    this.isOffline = value;
    if (!this.isOffline) {
      this.updateTasks();
    }
  }

  getTasks(userId: number): Observable<Object> {
    if (!this.isOffline) {
      return this.taskApiService.getTasks(userId).pipe(
        tap((tasks) => this.saveToLocal(this.tasksKey, tasks as ITasks)),
        catchError((error) => {
          console.error(error);
          return this.getFromLocalObservable<ITasks>(this.tasksKey);
        })
      );
    } else {
      return this.getFromLocalObservable<ITasks>(this.tasksKey);
    }
  }

  addTask(task: ITask) {
    if (!this.isOffline) {
      return this.taskApiService.addTask(task).pipe(
        tap((newTask) => this.changeLocalTask(newTask as ITask)),
        catchError((error) => {
          console.error(error);
          return of(task);
        })
      );
    } else {
      task.id = 'l' + Date.now();
      this.changeLocalTask(task);
      return of(task);
    }
  }

  deleteTask(taskId: string) {
    if (!this.isOffline) {
      return this.taskApiService.deleteTask(taskId).pipe(
        tap(() => this.deleteLocalTask(taskId)),
        catchError((error) => {
          console.error(error);
          return of(taskId);
        })
      );
    } else {
      const task = this.getFromLocal<ITasks>(this.tasksKey).todos.find((t: ITask) => t.id === taskId);
      this.changedTasks.set(task!, TaskStatus.deleted);
      this.deleteLocalTask(taskId);
      return of(taskId);
    }
  }

  changeStatus(taskId: string, completed: boolean) {
    const task = this.getFromLocal<ITasks>(this.tasksKey).todos.find((t: ITask) => t.id === taskId);
    task!.completed = !completed;
    if (!this.isOffline) {
      return this.taskApiService.changeStatus(taskId, completed).pipe(
        tap(() => this.changeLocalTask(task!)),
        catchError((error) => {
          console.error(error);
          return of(task);
        })
      );
    } else {
      this.changedTasks.set(task!, TaskStatus.statusChanged);
      this.changeLocalTask(task!);
      return of(task);
    }
  }

  changeTitleTask(taskId: string, todo: string) {
    const task = this.getFromLocal<ITasks>(this.tasksKey).todos.find((t: ITask) => t.id === taskId);
    task!.todo = todo;
    if (!this.isOffline) {
      return this.taskApiService.changeTitleTask(taskId, todo).pipe(
        tap(() => this.changeLocalTask(task!)),
        catchError((error) => {
          console.error(error);
          return of(task);
        })
      );
    } else {
      this.changedTasks.set(task!, TaskStatus.titleChanged);
      this.changeLocalTask(task!);
      return of(task!);
    }
  }

  private updateTasks() {
    const tasks = this.getFromLocal<ITasks>(this.tasksKey).todos;
    tasks.forEach((task: ITask) => {
      const isNew = task.id[0] === 'l';
      const status = this.changedTasks.has(task) ? this.changedTasks.get(task) : null;
      if (isNew) {
        if (status === TaskStatus.deleted) {
          this.deleteLocalTask(task.id);
          this.changedTasks.delete(task);
          return;
        }
        this.addTask(task).subscribe(() => {
          this.deleteLocalTask(task.id);
          this.proxyTasksUpdate.next(this.getFromLocal<ITasks>(this.tasksKey));
        }, () => {
          this.notificationService.show('Ошибка добавления задачи');
        });
      }
    });
    this.changedTasks.forEach((status, task) => {
      if (status === TaskStatus.deleted) {
        this.deleteTask(task.id).subscribe(() => {
          this.changedTasks.delete(task);
          this.proxyTasksUpdate.next(this.getFromLocal<ITasks>(this.tasksKey));
        }, () => {
          this.notificationService.show('Ошибка удаления задачи');
        });
        return;
      }
      if (status === TaskStatus.statusChanged) {
        this.changeStatus(task.id, task.completed).subscribe(() => {
          this.changedTasks.delete(task);
          this.proxyTasksUpdate.next(this.getFromLocal<ITasks>(this.tasksKey));
        }, () => {
          this.notificationService.show('Ошибка изменения статуса задачи');
        });
      }
      if (status === TaskStatus.titleChanged) {
        this.changeTitleTask(task.id, task.todo).subscribe(() => {
          this.changedTasks.delete(task);
          this.proxyTasksUpdate.next(this.getFromLocal<ITasks>(this.tasksKey));
        }, () => {
          this.notificationService.show('Ошибка изменения названия задачи');
        });
      }
    });
  }

  private saveToLocal<T>(key: string, data: T): void {
    this.storageService.saveItem(key, JSON.stringify(data));
  }

  private getFromLocalObservable<T>(key: string): Observable<T> {
    const tasks = JSON.parse(this.storageService.readItem(key) || '[]');
    return of(tasks as T);
  }

  private getFromLocal<T>(key: string): T {
    const tasks = JSON.parse(this.storageService.readItem(key) || '[]');
    return tasks as T;
  }

  private changeLocalTask(task: ITask): void {
    const tasks = JSON.parse(this.storageService.readItem(this.tasksKey) || '[]') as ITasks;
    const index = tasks.todos.findIndex((t: ITask) => t.id === task.id);
    if (index !== -1) {
      tasks.todos[index] = task;
    } else {
      tasks.todos.push(task);
    }
    this.storageService.saveItem(this.tasksKey, JSON.stringify(tasks));
  }

  private deleteLocalTask(taskId: string): void {
    const tasks = JSON.parse(this.storageService.readItem(this.tasksKey) || '[]') as ITasks;
    const index = tasks.todos.findIndex((t: ITask) => t.id === taskId);
    if (index !== -1) {
      tasks.todos.splice(index, 1);
    }
    this.storageService.saveItem(this.tasksKey, JSON.stringify(tasks));
  }
}
