import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

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
    public dialog: MatDialog) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
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
