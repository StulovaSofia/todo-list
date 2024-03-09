import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, HostBinding} from '@angular/core';
import {NotificationService} from '../../../service/notification.service';


// This component renders notification block with custom message
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('popInOut', [
      state('in', style({bottom: '32px'})),
      state('out', style({bottom: '-64px'})),
      transition('in <=> out', animate('0.2s ease-in-out')),
    ]),
  ],
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {
  }

  @HostBinding('@popInOut') get showNotification() {
    return this.notificationService.notificationShown ? 'in' : 'out';
  }
}
