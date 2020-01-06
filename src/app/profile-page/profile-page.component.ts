import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  myControl = new FormControl();
  options: any = [];
  optionals1 = new FormControl();
  optionals2 = new FormControl();
  optionalList1: any;
  optionalList2: any;
  filteredOptions: Observable<string[]>;
  user: any;
  group: string;
  optional1: any=[];
  optional2: any=[];
  sport = false;
  peda = false;
  yearOfStudy = 3;
  public submitWasHitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (user != null) {
        this.user = user;
        const username = user.email.split('@')[0];
        this.http.get('https://timetable.epixmobile.ro/schedule/groups/').subscribe(
          (response) => {
            this.options = response;
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value))
            );
          }
        );

        const promise = this.http.get('https://timetable.epixmobile.ro/auth/edit/' + username).toPromise();
        promise.then(
          (response) => {
            this.group = response['group'];
            this.sport = response['sport'];
            this.peda = response['peda'];
            this.optional1 = response['optionals'];
            // console.log('user optionals for 1st semester:', this.optional1);

            this.yearOfStudy = Number(this.group[1]);
            this.http.get('https://timetable.epixmobile.ro/auth/optionals/semester/' + this.yearOfStudy * 2).subscribe(
              (semester1Response) => {
                this.optionalList2 = semester1Response;
                // console.log('1st sem opts', semester1Response);
              }
            );
            this.http.get('https://timetable.epixmobile.ro/auth/optionals/semester/' + (this.yearOfStudy * 2 - 1)).subscribe(
              (semester2Response) => {
                this.optionalList1 = semester2Response;
                // console.log('2nd sem opts', semester2Response);
              }
            );
          }
        );
      }
    });
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  _capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  _submit() {
    this.submitWasHitted = true;
    // console.log(this.optional2);
    const username = this.user.email.split('@')[0];
    const allopts = this.optional1.concat(this.optional2);
    const payload = {
      group: this.group,
      sport: this._capitalize(this.sport.toString()),
      peda: this._capitalize(this.peda.toString()),
      optionals: allopts
    };

    console.log(payload);

    const promise = this.http.post('https://timetable.epixmobile.ro/auth/edit/' + username, payload).toPromise();
    promise.then(
      (response) => {
        console.log(response);
        this.router.navigate(['/timetable']);
      }
    );
  }

}

