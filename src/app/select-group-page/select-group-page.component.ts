import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-select-group-page',
  templateUrl: './select-group-page.component.html',
  styleUrls: ['./select-group-page.component.css']
})
export class SelectGroupPageComponent implements OnInit {

  optionals = new FormControl();
  options: string[];
  filteredOptions: Observable<string[]>;
  selectedGroup = '';
  firstOptional = [];
  secondOptional = [];
  firstSemesterOptList: string[];
  secondSemesterOptList: string[];
  user;
  statusSubscription: Subscription;


  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient) {
  }

  ngOnInit() {
    // Get the last user value
    this.statusSubscription = this.authService.getStatus().subscribe((status) => {

      // Skip this page if the user is already registered.
      if (status === false) {
        this.router.navigate(['/timetable']);
      }
    });

    // Loading all groups from the backend.
    this.http.get('https://timetable.epixmobile.ro/schedule/groups/')
      .subscribe(
        (response) => {
          this.options = response as string[];
          this.filteredOptions = this.optionals.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        });

    // Get the last user value
    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  private _filter(value: string): string[] {
    // Used for autocomplete.

    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  getOptionals() {
    // When a group is selected this method is called to update the two multi-select fields. By doing this
    // we allow the user to select the optional courses SPECIFIC to the selected group.

    if (this.selectedGroup && this.selectedGroup.length > 4) {
      let semester = parseInt(this.selectedGroup[1], 10) * 2 - 1;
      this.http.get('https://timetable.epixmobile.ro/auth/optionals/semester/' + semester)
        .subscribe((response) => {
          this.firstSemesterOptList = response as string[];
        });

      semester += 1;
      this.http.get('https://timetable.epixmobile.ro/auth/optionals/semester/' + semester)
        .subscribe((response) => {
          this.secondSemesterOptList = response as string[];
        });
    }
  }

  async set() {
    const username = this.user.email.split('@')[0];

    // The following console.log() has debug purposes.
    // Remove it when the register flow is complete.
    console.log(
      {
        uid: this.user.uid,
        name: this.user.displayName,
        group: this.selectedGroup,
        email: this.user.email,
        photo: this.user.photoURL,
        op1: this.firstOptional,
        op2: this.secondOptional,
        user: username,
        all: this.firstOptional.concat(this.secondOptional)
      }
    );
    // This section has debug purposes. Skip it.

    const authRegisterResponse = this.http.post('https://timetable.epixmobile.ro/auth/register/',
      {
        uid: this.user.uid,
        name: this.user.displayName,
        group: this.selectedGroup,
        email: this.user.email,
        photo: this.user.photoURL
      }
    ).toPromise();

    authRegisterResponse.then(() => {
      const authOptionalUsernameResponse = this.http.post('https://timetable.epixmobile.ro/auth/optionals/' + username,
      {
        sport: 'False',
        peda: 'False',
        optionals: this.firstOptional.concat(this.secondOptional)
      }
      ).toPromise();

      authOptionalUsernameResponse.then((response) => {
          console.log(response);
          this.authService.status.next(true);
          this.router.navigate(['/timetable']);
      });
    });
  }

}
