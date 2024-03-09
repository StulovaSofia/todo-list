import {Component, OnInit} from '@angular/core';
import {AuthService} from './service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public router: Router
  ) {
  }

  ngOnInit(): void {
    if (!this.authService.isLogged) {
      this.router.navigate(['login'])
      return;
    } else {
      this.router.navigate(['tasks'])
    }
  }
}
