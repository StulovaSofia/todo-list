import {Component, Input} from '@angular/core';
import {ITask} from '../../../interfaces/task';
import {TaskService} from '../../../service/task.service';
import {NotificationService} from '../../../service/notification.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  @Input() task: ITask = {} as ITask;

  public isEdit: boolean = false;

  constructor(public taskService: TaskService,
              private notificationService: NotificationService) {
  }

  deleteTask() {
    if (!this.isEdit) {
      this.taskService.deleteTask(this.task.id);
    }
  }

  changeStatus() {
    if (!this.isEdit) {
      this.taskService.changeStatus(this.task.id, this.task.completed);
    }
  }

  changeTitleTask() {
    if (this.task.todo.length >= 4) {
      this.isEdit = false;
      this.taskService.changeTitleTask(this.task.id, this.task.todo);
    } else {
      this.notificationService.show('Задача должна содержать минимум 4 символа');
      this.isEdit = true;
    }
  }
}
