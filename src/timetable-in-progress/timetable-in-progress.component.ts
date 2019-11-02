import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timetable-in-progress',
  templateUrl: './timetable-in-progress.component.html',
  styleUrls: ['./timetable-in-progress.component.css']
})
export class TimetableInProgressComponent implements OnInit {
  inProgressText = 'We are working on your timetable...';
  doneText = 'Your timetable is ready';
  showDoneMessage = false;
  showContinueButton = false;
  constructor() { }

  ngOnInit() {
    setTimeout(() => this.showDoneMessage = true, 3000);
    setTimeout(() => this.showContinueButton = true, 4000);
  }

}
