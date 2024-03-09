import {Component} from '@angular/core';
import {TaskService} from '../../../service/task.service';
import {UserService} from '../../../service/user.service';
import {ITask} from '../../../interfaces/task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {

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
