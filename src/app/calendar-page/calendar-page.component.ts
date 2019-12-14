import { Component, OnInit, ViewChild } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import { EventSettingsModel, 
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
  View } from '@syncfusion/ej2-angular-schedule';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { scheduleData } from './data';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService]
})
export class CalendarPageComponent implements OnInit {
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public showQuickInfo: Boolean = false;
  public scheduleHours: WorkHoursModel  = { highlight: true, start: '08:00', end: '20:00' };
  public selectedDate: Date = new Date();
  public weekNumber = this.computeWeek();
  public eventSettings: EventSettingsModel = { dataSource: <Object[]>extend([], scheduleData.University, null, true) };
  public currentView: View = "Week";
  public currentActivityType: String = "University";
  public activityTypes = ["University", "Personal", "Combined"]
  public setViews: View[] = ["WorkWeek", "Day", "TimelineDay", "Agenda"];
  public viewTypes = [
    {key: "Day", value: "Day"}, 
    {key: "TimelineDay", value: "Timeline"}, 
    {key: "WorkWeek", value: "Week"},
    {key: "Agenda", value: "Agenda"}];
  public navigationRightArrow: HTMLElement;
  public navigationLeftArrow: HTMLElement;
  public showHeaderBar: Boolean = false;
  public switchWeekOptions = ["Next week", "Previous week"]
  public switchWeekIndex = 0;
  public switchWeek: String = this.switchWeekOptions[this.switchWeekIndex];

  constructor(private http: HttpClient) { 
    http.get('http://timetable.epixmobile.ro/schedule/raul').subscribe(
      (response) => {
        var a = this.scheduleObj.getCurrentViewDates();
        let toto = {
          University: [],
          Personal: []
        }
        let dayName = ["monday", "tuesday", "wednesday", "thursday", "friday"]
        let k = 0;

        for(let j = 0; j < 5; j++) {
          for(let t = 0; t < Object.keys(response['1'][dayName[j]]).length; t++) {
            
            let start_time = new Date(a[j] as Date);
            start_time.setTime(start_time.setHours(response['1'][dayName[j]][t]['start_time'].split(':')[0] as number))
            
            let end_time = new Date(a[j] as Date);
            end_time.setTime(end_time.setHours(response['1'][dayName[j]][t]['start_time'].split(':')[0] as number))
            end_time.setTime(end_time.getTime() + (response['1'][dayName[j]][t]['duration'] * 60 * 60 * 1000))
            
            let activity = { Id: k,
              Subject: response['1'][dayName[j]][t]['title'],
              Location: response['1'][dayName[j]][t]['location'],
              StartTime: start_time,
              EndTime: end_time,
              CategoryColor: '#1aaa55' };
            
            toto.University.push(activity);
            k++;
          }
        }
        this.scheduleObj.eventSettings.dataSource = <Object[]>extend([], toto.University, null, true);
      }
    )
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
    if(this.currentActivityType === 'University') {
      this.scheduleObj.eventSettings.dataSource = scheduleData.University;
    } else if(this.currentActivityType === 'Personal') {
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
    var currentDate = this.scheduleObj.getCurrentViewDates()[0] as Date;
    this.switchWeekIndex += 1;
    this.switchWeek = this.switchWeekOptions[this.switchWeekIndex%2];
    if(this.switchWeekIndex%2 == 0) {
      this.selectedDate = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
      this.weekNumber -= 1;
    } else {
      this.selectedDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      this.weekNumber += 1;
    }
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
        let statusElement: HTMLInputElement = args.element.querySelector('#EventType') as HTMLInputElement;
        if (!statusElement.classList.contains('e-dropdownlist')) {
            let dropDownListObject: DropDownList = new DropDownList({
                placeholder: 'Choose activity type', value: statusElement.value,
                dataSource: ['Workshop', 'Sport', 'Movie']
            });
            dropDownListObject.appendTo(statusElement);
            statusElement.setAttribute('name', 'EventType');
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