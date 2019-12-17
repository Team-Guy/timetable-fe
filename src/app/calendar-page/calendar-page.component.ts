import { Component, OnInit, ViewChild } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import {
  EventSettingsModel,
  ScheduleComponent,
  ExportOptions,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  ResizeService,
  DragAndDropService,
  PopupOpenEventArgs,
  WorkHoursModel,
  View
} from '@syncfusion/ej2-angular-schedule';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { scheduleData } from './data';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService],
})
export class CalendarPageComponent implements OnInit {
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public showQuickInfo = false;
  public scheduleHours: WorkHoursModel = { highlight: true, start: '08:00', end: '20:00' };
  public selectedDate: Date = new Date();
  public weekNumber = this.computeWeek();
  public eventSettings: EventSettingsModel = { dataSource: <Object[]>extend([], scheduleData.University, null, true) };
  public currentView: View = 'Week';
  public currentActivityType: String = 'University';
  public activityTypes = ['University', 'Personal', 'Combined']
  public setViews: View[] = ['WorkWeek', 'Day', 'TimelineDay', 'Agenda'];
  public viewTypes = [
    { key: 'Day', value: 'Day' },
    { key: 'TimelineDay', value: 'Timeline' },
    { key: 'WorkWeek', value: 'Week' },
    { key: 'Agenda', value: 'Agenda' }];
  public navigationRightArrow: HTMLElement;
  public navigationLeftArrow: HTMLElement;
  public showHeaderBar = false;
  public switchWeekOptions = ['Next week', 'Previous week']
  public switchWeekIndex = 0;
  public switchWeek: string = this.switchWeekOptions[this.switchWeekIndex];

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    // aici e buba!!
    if (!this.authService.user) {
      this.delay(3000).then(() => {
        const username = this.authService.user.email.split('@')[0];
        this.http.get('https://timetable.epixmobile.ro/schedule/save_last/' + username).subscribe(
          (response) => {
            console.log(response);
            const a = this.scheduleObj.getCurrentViewDates();
            let toto = {
              University: [],
              Personal: []
            }
            let dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            let k = 0;

            for (let j = 0; j < 5; j++) {
              for (let t = 0; t < Object.keys(response['school']['1'][dayName[j]]).length; t++) {

                let start_time = new Date(a[j] as Date);
                start_time.setTime(start_time.setHours(response['school']['1'][dayName[j]][t]['start_time'].split(':')[0] as number));

                let end_time = new Date(a[j] as Date);
                end_time.setTime(end_time.setHours(response['school']['1'][dayName[j]][t]['start_time'].split(':')[0] as number));
                end_time.setTime(end_time.getTime() + (response['school']['1'][dayName[j]][t]['duration'] * 60 * 60 * 1000));

                let activity = {
                  Id: k,
                  Subject: response['school']['1'][dayName[j]][t]['title'],
                  Location: response['school']['1'][dayName[j]][t]['location'],
                  StartTime: start_time,
                  EndTime: end_time,
                  CategoryColor: 'red'
                };

                toto.University.push(activity);
                k++;
              }
            }
            this.scheduleObj.eventSettings.dataSource = <Object[]>extend([], toto.University, null, true);
          }, (error) => { console.log('error', error); }
        );
      });
    }
  }

  ngOnInit() {
  }

  public onExportClick(): void {
    const exportValues: ExportOptions = { fields: ['Id', 'Subject', 'StartTime', 'EndTime', 'Location'] };
    this.scheduleObj.exportToExcel(exportValues);
  }

  public download() {
    this.onExportClick();
  }

  public radioGroupView() {
    if (this.currentActivityType === 'University') {
      this.scheduleObj.eventSettings.dataSource = scheduleData.University;
    } else if (this.currentActivityType === 'Personal') {
      this.scheduleObj.eventSettings.dataSource = scheduleData.Personal;
    } else {
      this.scheduleObj.eventSettings.dataSource = scheduleData.All;
    }
  }

  public computeWeek() {
    // First month is determined by 0.
    var startDate = new Date(2019, 8, 30);
    var diff = Math.abs(this.selectedDate.getTime() - startDate.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return Math.ceil(diffDays / 7);
  }

  public switch() {
    const currentDate = this.scheduleObj.getCurrentViewDates()[0] as Date;
    this.switchWeekIndex += 1;
    this.switchWeek = this.switchWeekOptions[this.switchWeekIndex % 2];
    if (this.switchWeekIndex % 2 === 0) {
      this.selectedDate = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
      this.weekNumber -= 1;
    } else {
      this.selectedDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      this.weekNumber += 1;
    }
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
      let statusElement: HTMLInputElement = args.element.querySelector('#PriorityType') as HTMLInputElement;
      if (!statusElement.classList.contains('e-dropdownlist')) {
        let dropDownListObject: DropDownList = new DropDownList({
          placeholder: 'Activity priority', value: statusElement.value,
          dataSource: ['Low', 'Medium', 'High']
        });
        dropDownListObject.appendTo(statusElement);
        statusElement.setAttribute('name', 'PriorityType');
      }
      let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
      if (!startElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
      }
      let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
      if (!endElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
      }
    }
  }
}
