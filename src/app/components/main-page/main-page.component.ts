import {Component} from '@angular/core';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(public userService: UserService) {
    this.userService.loadUserInfo();
  }
}
