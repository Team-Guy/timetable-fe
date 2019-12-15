import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogContentExampleDialog } from '../optimization-flow/optimization-flow.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  showMenu = false;
  user: firebase.User;
  photoURL: string;
  displayName: string;
  email: string;

  ngOnInit() {
    // Get the last user value
    this.user = this.authService.getUser();
    if (this.user) {
      this.showMenu = true;
      this.displayName = this.displayName;
      this.photoURL = this.user.photoURL;
      this.email = this.user.email;
    }
  }

  constructor(public dialog: MatDialog, private authService: AuthService, private router: Router) {
      // Get the last user value
      this.user = this.authService.getUser();
      // subscribe to auth component messages
      this.subscription = this.authService.getMessage().subscribe(message => {
        if (message) {
          // set user object
          this.showMenu = message.showMenu;
          this.user = message['user'];
          this.displayName = message.user['displayName'];
          this.photoURL = message.user['photoURL'];
          this.email = message.user['email'];
          this.authService.commitUser(message.user);
          console.log(this.user);
        } else {
          // remove side menu when empty message received
          this.showMenu = false;
          this.user = null;
          this.authService.menuDisplaySettings = false;
          this.authService.user = null;
        }
      });
  }

  ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.subscription.unsubscribe();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  signOut() {
    this.showMenu = false;
    this.user = null;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
