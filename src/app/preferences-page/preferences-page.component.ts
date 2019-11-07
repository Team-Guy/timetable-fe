import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preferences-page',
  templateUrl: './preferences-page.component.html',
  styleUrls: ['./preferences-page.component.css']
})
export class PreferencesPageComponent implements OnInit {

  name = 'Alexandra';
  dearMessage = `Dear ${this.name}, `;
  mainMessage = `We do really care about your experience at Babes-Bolyai University. By letting us know your preferences, 
                we can put our best algorithms to work on a schedule perfectly fitted to your needs.`
  matterMessage = `Tell us what really matters to you. You can change the preferenes whenever you decide from your 
                profile settings.`
  preferences = ["Not before 10am", "No break between activities"]

  constructor() { }

  ngOnInit() {
  }

}
