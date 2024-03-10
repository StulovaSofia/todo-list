import {Component, HostBinding} from '@angular/core';
import {TaskService} from '../../../service/task.service';
import {UserService} from '../../../service/user.service';
import {ITask} from '../../../interfaces/task';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [
    trigger('taskListAnimation', [
      transition('* <=> *', [ // Срабатывает при любом изменении
        query(':enter', [ // Для новых элементов (входящих)
          style({ opacity: 0, transform: 'translateY(-30px)' }),
          stagger('50ms', animate('600ms ease-out', style({ opacity: 1, transform: 'none' })))
        ], { optional: true }),
        query(':leave', [ // Для удаляемых элементов (исходящих)
          animate('300ms', style({ opacity: 0, transform: 'scale(0.5)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class TaskListComponent {
  @HostBinding('@taskListAnimation') taskListAnimation = true;

  constructor(public taskService: TaskService, public userService: UserService) {
    this.getTasks();
  }

  get isLoaded(): boolean {
    return this.taskService.isLoaded;
  }

  get tasks(): ITask[] {
    return this.taskService.tasks.todos;
  }

  getTasks() {
    this.userService.isUserLoadedEvent.subscribe((isLoaded) => {
      if (isLoaded) {
        this.taskService.loadTasks(this.userService.user.id);
      }
    });
  }
}
