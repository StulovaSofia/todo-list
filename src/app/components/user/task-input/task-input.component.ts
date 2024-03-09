import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TaskService} from "../../../service/task.service";
import {IUser} from "../../../interfaces/user";
import {UserService} from "../../../service/user.service";
import {ITask} from "../../../interfaces/task";

@Component({
  selector: 'app-task-input',
  templateUrl: './task-input.component.html',
  styleUrls: ['./task-input.component.scss']
})
export class TaskInputComponent {
  public taskForm!: FormGroup;

  constructor(public taskService: TaskService, public userService: UserService) {
    this.taskForm = new FormGroup({
      todo: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  get userInfo(): IUser {
    return this.userService.user;
  }

  get inProgress(): boolean {
    return this.taskService.inProgress;
  }

  addTask() {
    let form = {}
    for (const key in this.taskForm.controls) {
      form = {...form, [key]: this.taskForm.controls[key].value};
    }
    form = {...form, ['userId']: this.userInfo.id};
    form = {...form, ['completed']: false};
    this.taskService.addTask(form as ITask);
    this.taskForm.reset();
  }
}
