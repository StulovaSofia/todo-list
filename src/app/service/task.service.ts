import {Injectable} from '@angular/core';
import {ITask, ITasks} from "../interfaces/task";
import {finalize} from "rxjs";
import {NotificationService} from "./notification.service";
import {ProxyService} from "./proxy.service";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public isLoaded: boolean = false;
  public inProgress: boolean = false;
  public tasks: ITasks = {} as ITasks;

  constructor(public proxyService: ProxyService,
              private notificationService: NotificationService) {
    this.proxyService.proxyTasksUpdate.subscribe((data: ITasks) => {
      this.tasks = data;
    });
  }

  addTask(task: ITask) {
    this.inProgress = true;
    this.proxyService.addTask(task)
      .pipe(
        finalize(() => {
          this.inProgress = false;
        }),
      ).subscribe(
      (data: any) => {
        this.tasks.todos.push(data);
      },
      () => {
        this.notificationService.show('Ошибка добавления задачи');
      }
    )
  }

  loadTasks(userId: number) {
    this.isLoaded = false;
    this.proxyService.getTasks(userId)
      .pipe(
        finalize(() => {
          this.isLoaded = true;
        }),
      ).subscribe(
      (data: any) => {
        this.tasks = data;
      },
      () => {
        this.notificationService.show('Ошибка загрузки задач');
      }
    )
  }

  deleteTask(taskId: string) {
    this.proxyService.deleteTask(taskId)
      .subscribe(
        () => {
          this.tasks.todos.forEach(i => {
            if (i.id === taskId) {
              this.tasks.todos.splice(this.tasks.todos.indexOf(i), 1);
            }
          })
        },
        () => {
          this.notificationService.show('Ошибка удаления задачи');
        }
      )
  }

  changeStatus(taskId: string, completed: boolean) {
    this.proxyService.changeStatus(taskId, completed)
      .subscribe(
        () => {
          this.tasks.todos.forEach(i => {
            if (i.id === taskId) {
              i.completed = !i.completed;
            }
          })
        },
        () => {
          this.notificationService.show('Ошибка изменения статуса задачи');
        }
      )
  }

  changeTitleTask(taskId: string, todo: string) {
    this.proxyService.changeTitleTask(taskId, todo)
      .subscribe(
        () => {
          this.tasks.todos.forEach(i => {
            if (i.id === taskId) {
              i.todo = todo;
            }
          })
        },
        () => {
          this.notificationService.show('Ошибка изменения названия задачи');
        }
      )
  }

  sortingByCompleted() {
    this.tasks.todos.sort((a, b) => {
      if (a.completed && !b.completed) {
        return 1;
      }
      if (!a.completed && b.completed) {
        return -1;
      }
      return 0;
    })
  }

  sortingById() {
    this.tasks.todos.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    })
  }
}
