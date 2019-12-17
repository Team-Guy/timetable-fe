import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebase: AngularFireAuth) {
    this.firebase.authState.subscribe(firebaseUser => {
      if (firebaseUser != null) {
        this.user = firebaseUser;
        this.subject.next({showMenu: true, user: firebaseUser});
      } else {
        // ...
      }
    });
  }

  private subject = new Subject<any>();
  googleAuthProvider = new auth.GoogleAuthProvider();
  user: any;
  menuDisplaySettings = false;
  isNewUser = false;

  sendMessage(json) {
      this.subject.next(json);
  }

  clearMessages() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }

  commitUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  commitMenuDisplaySettings(menuDisplaySettings) {
    this.menuDisplaySettings = menuDisplaySettings;
  }

  getMenuDisplaySettings() {
    return this.menuDisplaySettings;
  }

  skipRegister(): boolean {
    return this.menuDisplaySettings;
  }

  login() {
    this.firebase.auth.signInWithPopup(this.googleAuthProvider).then((result) => {
      this.isNewUser = result.additionalUserInfo.isNewUser;
      this.user = result.user;
    }).catch((error) => {
      // Handle Errors here.
      console.log('error', error);
    });
  }

  logout() {
    this.firebase.auth.signOut().then((result) => {
      // Sign-out successful.
    }, (error) => {
      // An error happened.
    });
    this.menuDisplaySettings = false;
    this.user = null;
  }
}
