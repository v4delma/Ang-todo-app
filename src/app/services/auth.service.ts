import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user!: User | null;

  constructor(private auth: Auth) {}

  // Rekisteröityminen
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        console.log('Successfully signed up!', res);
        this.user = res.user;
        sessionStorage.setItem('loggedin', 'true');
      })
      .catch((error) => {
        console.log('Something is wrong:', error.message);
      });
  }

  // Sisäänkirjautuminen
  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        console.log('Successfully signed in!', res);
        this.user = res.user;
        sessionStorage.setItem('loggedin', 'true');
      })
      .catch((error) => {
        console.log('Something is wrong:', error.message);
      });
  }

  // Uloskirjautuminen
  signOut() {
    sessionStorage.clear();
    return signOut(this.auth);
  }
}
