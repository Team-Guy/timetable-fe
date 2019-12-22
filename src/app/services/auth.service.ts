import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  googleAuthProvider = new auth.GoogleAuthProvider();
  user = new BehaviorSubject<firebase.User>(null);
  status = new BehaviorSubject<boolean>(false);
  registrationCompleted = new BehaviorSubject<boolean>(false);

  constructor(
    private firebase: AngularFireAuth,
    private http: HttpClient) {
    this.firebase.authState.subscribe(firebaseUser => {
      if (firebaseUser != null) {
        this.user.next(firebaseUser);
        const promise = this.http.get('https://timetable.epixmobile.ro/auth/edit/' + firebaseUser.email.split('@')[0]).toPromise();
        promise.then(
          (response) => {
            if (response['group'] != null) {
              this.registrationCompleted.next(true);
            }
          });
      }
    });
  }

  getUser(): Observable<any> {
      return this.user.asObservable();
  }

  getStatus(): Observable<any> {
    return this.status.asObservable();
  }

  getRegistrationCompleted(): Observable<any> {
    return this.registrationCompleted.asObservable();
  }

  login() {
    this.firebase.auth.signInWithPopup(this.googleAuthProvider).then((result) => {
      this.status.next(result.additionalUserInfo.isNewUser);
      this.user.next(result.user);
    }).catch((error) => {
      console.log('error', error);
    });
  }

  logout() {
    this.firebase.auth.signOut().then((result) => {
      // Success.
    }, (error) => {
      // An error happened.
    });
    this.registrationCompleted.next(false);
  }
}
