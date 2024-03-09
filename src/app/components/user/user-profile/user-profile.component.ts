import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {IUser} from '../../../interfaces/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  constructor(public userService: UserService) {
  }

  get isUserLoaded(): boolean {
    return this.userService.isUserLoaded;
  }

  get user(): IUser {
    return this.userService.user;
  }
}
