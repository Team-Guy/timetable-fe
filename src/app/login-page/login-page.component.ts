import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  disableLogIn = false;

  constructor(
    private elementRef: ElementRef,
    private firebase: AngularFireAuth,
    private router: Router,
    private authService: AuthService) {
  }

  onLoginIntent(): void {
    this.authService.login();
  }

  ngOnInit() {
    this.firebase.authState.subscribe(firebaseUser => {
      if (firebaseUser != null) {
        this.authService.sendMessage({ showMenu: false, user: firebaseUser });
        this.authService.commitUser(firebaseUser);
        if (this.authService.isNewUser) {
          this.router.navigate(['/selectgroup']);
          console.log(firebaseUser);
        } else {
          this.authService.sendMessage({showMenu: true});
          this.authService.commitMenuDisplaySettings(true);
          this.router.navigate(['/timetable']);
        }
      } else {
        this.authService.commitUser(firebaseUser);
        this.authService.clearMessages();
      }
    });
  }
}
