import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../services/auth.service';

export interface Section {
  name: string;
  type: string;
  reason: string;
  initialDate: Date;
  finalDate: Date;
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
  algoDone = false;
  algoResponse: any;
  public endMessage = '';
  public endMessageDescription = '';
  diffs: any=[];
  freq={
    "par":'2',
    "impar":'1',
    "full":'1, 2'
  };

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  diffsAccepted: any=[];
  diffsRejected: any=[];
  diffsUnchanged: any=[];

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
    this.foobar();
  }

  foobar() {
    this.authService.getUser().subscribe((user) => {
      if (user != null) {
        this.user = user;
        const username = this.user.email.split('@')[0];
        this.http.get('https://timetable.epixmobile.ro/auth/preferences/' + username).subscribe(
          (response) => {
            // console.log(response);
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
    });
  }

  goToSecondStep() {

    const username = this.user.email.split('@')[0];
    const payload = {
      id: this.userId,
      mondayStart: this.monsd,
      mondayEnd: this.moned,
      tuesdayStart: this.tuesd,
      tuesdayEnd: this.tueed,
      wednesdayStart: this.wedsd,
      wednesdayEnd: this.weded,
      thursdayStart: this.thusd,
      thursdayEnd: this.thued,
      fridayStart: this.frisd,
      fridayEnd: this.fried,
      mondayMax: this.monmh,
      tuesdayMax: this.tuemh,
      wednesdayMax: this.wedmh,
      thursdayMax: this.thumh,
      fridayMax: this.frimh
    };
    console.log(payload);
    this.http.post('https://timetable.epixmobile.ro/auth/preferences/' + username, payload).subscribe(
      (response) => {
        this.http.get(`https://timetable.epixmobile.ro/schedule/algo/${username}/`).subscribe((response) => {
          this.algoDone = true;
          this.algoResponse = response;
          this.diffs=this.algoResponse['diffs'];
          console.log(this.algoResponse);
          this.diffs.forEach(diff=>{
            if(diff.n_week!='null'){
              this.diffsAccepted.push(diff);
            }else{
              this.diffsRejected.push(diff);
            }
          });
          for(let id of Object.keys(this.algoResponse['bypass']['school'])){
            this.diffsUnchanged.push(this.algoResponse['bypass']['school'][id]);
          }

          console.log(this.diffsUnchanged);
        });
      }
    );
  }

  userDroppedChanges() {
    this.endMessageDescription = 'Try to read our guidelines in order to get better results.';
    this.endMessage = 'Oh.. it happens. Don\'t be mad on us!';
  }

  userAgreedToChange() {
    const username = this.user.email.split('@')[0];
    console.log(username);
    this.endMessageDescription = '';
    this.endMessage = 'Great! We\'re setting up your schedule.';
    const payload={
      'school': this.algoResponse['school'],
      'extra': this.algoResponse['extra']
    };
    console.log(payload);
    this.http.post(`https://timetable.epixmobile.ro/schedule/save_last/${username}`, payload).subscribe(result=> {
      console.log(result);
    });
    // this.http.post(`http://localhost:8000/schedule/save_last/${username}`, payload).subscribe(result=> {
    //   console.log(result);
    // });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  t() {
    this.algoDone = true;
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
}
