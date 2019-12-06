import { Component, OnInit } from '@angular/core';
import { DialogContentExampleDialog } from '../optimization-flow/optimization-flow.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public userName: String = "Raul Burian";
  public emailAddress: String = "raulburian@gmail.com";

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
