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
  userSubscription: Subscription;
  registrationSubscription: Subscription;
  showMenu = false;
  photoURL: string;
  displayName: string;
  email: string;

  ngOnInit() {
    // Get the last user value
    this.userSubscription = this.authService.getUser().subscribe((user) => {
      if (user != null) {
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        this.email = user.email;
      }
    });

    // Get the last status value
    this.registrationSubscription = this.authService.getRegistrationCompleted().subscribe((registrationCompleted) => {
      this.showMenu = registrationCompleted;
    });
  }

  constructor(public dialog: MatDialog, private authService: AuthService, private router: Router) {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
    dialogRef.afterClosed().subscribe(result => {});
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.userSubscription.unsubscribe();
      this.registrationSubscription.unsubscribe();
  }
}
