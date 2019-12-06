import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  googleAuthProvider = new auth.GoogleAuthProvider();

  constructor(private elementRef: ElementRef, private firebase: AngularFireAuth, private router: Router) {
  }

  onLoginIntent() {
    this.firebase.auth.signInWithPopup(this.googleAuthProvider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = (<any>result).credential.accessToken;
      // The signed-in user info.
      this.user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  ngOnInit() {
    this.firebase.authState.subscribe(user => {
      if(user != null) {
        this.router.navigate(['/selectgroup']);
      } else {
        // ...
      }
    });
  }

}
