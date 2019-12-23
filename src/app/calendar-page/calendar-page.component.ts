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
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarService } from '../google/calendar.service';


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
  public eventSettings: EventSettingsModel = { dataSource: extend([], [], null, true) as object[] };
  public currentView: View = 'Week';
  public currentActivityType = 'University';
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
  public mapDaysDates;
  public RAWtimetable;
  public user;

  userSubscription: Subscription;
  statusSubscription: Subscription;

  generateUniversityActivityObject(activity, day, activityNo) {
    const startTime = new Date(this.mapDaysDates.get(day.toString()) as Date);
    startTime.setTime(startTime.setHours(activity.start_time.split(':')[0] as number));

    const endTime = new Date(this.mapDaysDates.get(day.toString()) as Date);
    endTime.setTime(endTime.setHours(activity.start_time.split(':')[0] as number));
    endTime.setTime(endTime.getTime() + (activity.duration * 60 * 60 * 1000));

    return {
      Id: activityNo,
      Subject: activity.title,
      Location: activity.location,
      StartTime: startTime,
      EndTime: endTime,
      Type: activity.type,
      IsReadonly: true,
      CategoryColor: 'not set'
    };
  }

  parseuniversityActivitiesForWeek(week) {
    const universityActivities = [];

    let activitiesNo = 0;
    for (const day of Object.keys(week)) {
      // console.log(day);
      for (const hour of Object.keys(week[day])) {
        let activity = week[day][hour];
        // console.log(activity);
        if (activity != null) {
          // Deduplication process takes place here.
          if (universityActivities.length === 0) {
            activitiesNo += 1;
            activity = this.generateUniversityActivityObject(activity, day, activitiesNo);
            universityActivities.push(activity);
          } else if (activity.title !== universityActivities[universityActivities.length - 1].Subject ||
            activity.type !== universityActivities[universityActivities.length - 1].Type) {
            activitiesNo += 1;
            activity = this.generateUniversityActivityObject(activity, day, activitiesNo);
            universityActivities.push(activity);
          }
        }
      }
    }

    return universityActivities;
  }

  getUniversityActicities() {
    // Determine which week is placed first.
    let firstWeek;
    let secondWeek;
    if (this.computeWeek() % 2 === 1) {
      firstWeek = this.RAWtimetable['school']['1'];
      secondWeek = this.RAWtimetable['school']['2'];
    } else {
      firstWeek = this.RAWtimetable['school']['2'];
      secondWeek = this.RAWtimetable['school']['1'];
    }

    // Map a given day of the week to a precise date.
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const currentDisplayedDates: Date[] = this.scheduleObj.getCurrentViewDates() as Date[];
    this.mapDaysDates = new Map();

    // Get the current displayed dates.
    for (let itDates = 0; itDates < currentDisplayedDates.length; itDates++) {
      this.mapDaysDates.set(weekDays[itDates], currentDisplayedDates[itDates]);
    }

    // Get the activities.
    const oddWeek = this.parseuniversityActivitiesForWeek(firstWeek);

    // Update the dates for the next week.
    this.mapDaysDates = new Map();

    // Get the activities.
    for (let itDates = 0; itDates < currentDisplayedDates.length; itDates++) {
      this.mapDaysDates.set(weekDays[itDates], new Date(currentDisplayedDates[itDates].getTime() + (7 * 24 * 60 * 60 * 1000)));
    }
    const evenWeek = this.parseuniversityActivitiesForWeek(secondWeek);

    // Concatenate the results and update the model.
    const allActivities = [].concat(oddWeek).concat(evenWeek);
    return allActivities;
  }

  setTimetableOnAllActivities() {
    const allActivities = this.getUniversityActicities();
    // allActivities.concat(this.getUniversityActicities());
    this.scheduleObj.eventSettings.dataSource = extend([], allActivities, null, true) as object[];
  }

  setTimetableOnUniversityActivities() {
    const allActivities = this.getUniversityActicities();
    // allActivities.concat(this.getUniversityActicities());
    this.scheduleObj.eventSettings.dataSource = extend([], allActivities, null, true) as object[];
  }

  setTimetableOnPersonalActivities() {
    // const allActivities = this.getUniversityActicities();
    // allActivities.concat(this.getUniversityActicities());
    this.scheduleObj.eventSettings.dataSource = extend([], [], null, true) as object[];
  }

  getRAWtimetable() {
    const username = this.user.email.split('@')[0];
    this.http.get('https://timetable.epixmobile.ro/schedule/save_last/' + username).subscribe(
      (response) => {
        this.RAWtimetable = response;
        this.setTimetableOnAllActivities();
      }, (error) => { console.log('error', error); }
    );
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private auth: CalendarService) {}

  ngOnInit() {
    // Get the last user value
    this.userSubscription = this.authService.getUser().subscribe((user) => {
      if (user != null) {
        this.user = user;
        this.getRAWtimetable();
      }
    });
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
      this.setTimetableOnUniversityActivities();
    } else if (this.currentActivityType === 'Personal') {
      this.setTimetableOnPersonalActivities();
    } else {
      this.setTimetableOnAllActivities();
    }
  }

  public computeWeek() {
    // First month is determined by 0.
    const startDate = new Date(2019, 8, 30);
    const diff = Math.abs(this.selectedDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
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
      const statusElement: HTMLInputElement = args.element.querySelector('#PriorityType') as HTMLInputElement;
      if (!statusElement.classList.contains('e-dropdownlist')) {
        const dropDownListObject: DropDownList = new DropDownList({
          placeholder: 'Activity priority', value: statusElement.value,
          dataSource: ['Low', 'Medium', 'High']
        });
        dropDownListObject.appendTo(statusElement);
        statusElement.setAttribute('name', 'PriorityType');
      }
      const startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
      if (!startElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
      }
      const endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
      if (!endElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
      }
    }
  }
}
