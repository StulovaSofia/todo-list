import {Injectable} from '@angular/core';
import {UserApiService} from '../api/user-api.service';
import {IUser} from '../interfaces/user';
import {BehaviorSubject, finalize} from 'rxjs';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public isUserLoadedEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isUserLoaded: boolean = false;

  private userData: IUser = {} as IUser;

  constructor(public userApiService: UserApiService,
              private notificationService: NotificationService) {
  }

  get user(): IUser {
    return this.userData;
  }

  loadUserInfo() {
    this.isUserLoadedEvent.next(false);
    this.isUserLoaded = false;
    this.userApiService.getUser()
      .pipe(
        finalize(() => {
          this.isUserLoadedEvent.next(true);
          this.isUserLoaded = true;
        }),
      )
      .subscribe({
        next: (res) => {
          this.userData = res as IUser;
        },
        error: () => {
          this.notificationService.show('Ошибка загрузки профиля');
        },
      })
  }
}
