import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email!: string;
  password!: string;
  invalidCredentials = false;
  invalidCredentialsMessage = 'Väärä käyttäjätunnus tai salasana';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.signUp(this.email, this.password).then(() => {
      if (this.authService.user) {
        this.router.navigate(['todos']);
      }
    });
    this.email = '';
    this.password = '';
  }

  login() {
    this.authService.signIn(this.email, this.password).then(() => {
      if (this.authService.user) {
        this.router.navigate(['todos']);
      } else {
        this.invalidCredentials = true;
        setTimeout(() => {
          this.invalidCredentials = false;
        }, 3000);
      }
    });
    this.email = '';
    this.password = '';
  }
}
