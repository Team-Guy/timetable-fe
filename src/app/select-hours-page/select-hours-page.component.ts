import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-hours-page',
  templateUrl: './select-hours-page.component.html',
  styleUrls: ['./select-hours-page.component.css']
})
export class SelectHoursPageComponent implements OnInit {

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  message = "Please tell us your time frame for each day"

  constructor() { }

  ngOnInit() {
  }

}
