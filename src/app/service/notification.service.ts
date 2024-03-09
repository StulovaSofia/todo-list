import {Injectable} from '@angular/core';

export enum NotyfyType {
  INFO,
  WARNING,
  ERROR,
}

const NOTIFY_TTL = 15000;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notificationShown: boolean = false;
  public type: NotyfyType = NotyfyType.INFO;
  public message: string = '';

  protected timer: NodeJS.Timeout | null = null;

  get isInfo() {
    return this.type === NotyfyType.INFO;
  }

  get isWarning() {
    return this.type === NotyfyType.WARNING;
  }

  get isError() {
    return this.type === NotyfyType.ERROR;
  }

  show(message: string, type: NotyfyType = NotyfyType.ERROR) {
    this.message = message;
    this.type = type;
    this.notificationShown = true;

    this.timer = setTimeout(() => {
      this.hide();
    }, NOTIFY_TTL);
  }

  hide() {
    this.notificationShown = false;
    this.timer = null;
  }
}
