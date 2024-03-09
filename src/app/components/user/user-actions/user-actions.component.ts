import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {TaskService} from "../../../service/task.service";
import {ProxyService} from "../../../service/proxy.service";

@Component({
  selector: 'app-user-actions',
  templateUrl: './user-actions.component.html',
  styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent {
  constructor(public authService: AuthService, public router: Router,
              public taskService: TaskService, public proxyService: ProxyService) {
  }

  logOut() {
    this.authService.deleteToken();
    this.router.navigate(['/']);
  }

  setOffline(isOffline: boolean) {
    this.proxyService.offline = isOffline;
  }

  sortingByCompleted() {
    this.taskService.sortingByCompleted();
  }

  sortingById() {
    this.taskService.sortingById();
  }
}
