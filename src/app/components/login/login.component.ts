import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {ILoginForm} from '../../interfaces/login';
import {Router} from '@angular/router';
import {NotificationService} from '../../service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public inProgress: boolean = false;

  constructor(public authService: AuthService,
              public router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    if (this.authService.isLogged) {
      this.router.navigate(['tasks'])
    }
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required,
        Validators.minLength(4)]),
      password: new FormControl('', [Validators.required,
        Validators.minLength(4)]),
    });
  }

  isFieldInvalid(fieldName: string) {
    return this.loginForm.controls[fieldName].touched &&
      !this.loginForm.controls[fieldName].valid;
  }

  login() {
    this.inProgress = true;
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.controls[key].setValue(this.loginForm.controls[key].value.trim());
    });
    this.authService
      .login({
        ...this.loginForm.value,
      } as ILoginForm)
      .subscribe({
        next: () => {
          this.router.navigate(['tasks'])
        },
        error: () => {
          this.notificationService.show('Ошибка авторизации');
          this.loginForm.controls['login'].markAsPristine();
          this.loginForm.controls['password'].markAsPristine();
        },
      })
      .add(() => {
        this.inProgress = false;
      });
  }
}
