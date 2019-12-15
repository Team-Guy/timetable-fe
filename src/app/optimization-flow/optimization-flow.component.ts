import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http'
import { AuthService } from '../services/auth.service';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-optimization-flow',
  templateUrl: './optimization-flow.component.html',
  styleUrls: ['./optimization-flow.component.css']
})
export class OptimizationFlowComponent implements OnInit {
  monsd: string;
  moned: string;
  monmh: string;
  tuesd: string;
  tueed: string;
  tuemh: string;
  wedsd: string;
  weded: string;
  wedmh: string;
  thusd: string;
  thued: string;
  thumh: string;
  frisd: string;
  fried: string;
  frimh: string;
  user: any;
  userId: string;
  public endMessage: String = "";
  public endMessageDescription: String = "";
  public folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
    this.user = this.authService.getUser();
    //let username = this.user.email.split('@')[0];
    let username='15dec2';
    this.http.get('https://timetable.epixmobile.ro/auth/preferences/'+username).subscribe(
      (response) => {
        console.log(response);
        this.monsd = response['mondayStart'];
        this.moned = response['mondayEnd'];
        this.monmh = response['mondayMax'];
        this.tuesd = response['tuesdayStart'];
        this.tueed = response['tuesdayEnd'];
        this.tuemh = response['tuesdayMax'];
        this.wedsd = response['wednesdayStart'];
        this.weded = response['wednesdayEnd'];
        this.wedmh = response['wednesdayMax'];
        this.thusd = response['thursdayStart'];
        this.thued = response['thursdayEnd'];
        this.thumh = response['thursdayMax'];
        this.frisd = response['fridayStart'];
        this.fried = response['fridayEnd'];
        this.frimh = response['fridayMax'];
        this.userId = response['id'];
      }
    );
  }

  goToSecondStep(){
    this.user = this.authService.getUser();
    //let username = this.user.email.split('@')[0];
    let username='15dec2';
    let payload = {
      "id": this.userId,
      "mondayStart": this.monsd,
      "mondayEnd": this.moned,
      "tuesdayStart": this.tuesd,
      "tuesdayEnd": this.tueed,
      "wednesdayStart": this.wedsd,
      "wednesdayEnd": this.weded,
      "thursdayStart": this.thusd,
      "thursdayEnd": this.thued,
      "fridayStart": this.frisd,
      "fridayEnd": this.fried,
      "mondayMax": this.monmh,
      "tuesdayMax": this.tuemh,
      "wednesdayMax": this.wedmh,
      "thursdayMax": this.thumh,
      "fridayMax": this.frimh,
    }
    this.http.post('https://timetable.epixmobile.ro/auth/preferences/'+username, payload).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }

  userDroppedChanges () {
    this.endMessageDescription = "Try to read our guidelines in order to get better results.";
    this.endMessage = "Oh.. it happens. Don't be mad on us!";
  }

  userAgreedToChange () {
    this.endMessageDescription = "";
    this.endMessage = "Great! We're setting up your schedule.";
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {}
