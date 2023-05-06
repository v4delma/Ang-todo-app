import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authservice: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (
      this.authservice.user ||
      sessionStorage.getItem('loggedin') === 'true'
    ) {
      console.log(sessionStorage.getItem('loggedin'));
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
