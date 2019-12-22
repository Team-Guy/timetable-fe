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
        this.authService.user.next(firebaseUser);
        this.authService.getStatus().subscribe((status) => {
          if (status === true) {
            this.router.navigate(['/selectgroup']);
          } else {
            this.router.navigate(['/timetable']);
          }
        });
      }
    });
  }
}
