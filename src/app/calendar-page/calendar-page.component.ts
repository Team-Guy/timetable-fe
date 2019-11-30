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
  View } from '@syncfusion/ej2-angular-schedule';
import { scheduleData } from './data';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService]
})
export class CalendarPageComponent implements OnInit {
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public weekNumber = this.computeWeek();
  public selectedDate: Date = new Date(2019, 11, 28);
  public eventSettings: EventSettingsModel = { dataSource: <Object[]>extend([], scheduleData.University, null, true) };
  public currentView: View = "Day";
  public currentActivityType: String = "University";
  public activityTypes = ["University", "Personal", "Combined"]
  public setViews: View[] = ["Day", "TimelineDay", "Week", "WorkWeek", "Agenda"];
  public viewTypes = [
    {key: "Day", value: "Day overview"}, 
    {key: "TimelineDay", value: "Day timeline"}, 
    {key: "Week", value: "Week overview"}, 
    {key: "WorkWeek", value: "Work week"},
    {key: "Agenda", value: "Agenda"}];
  public navigationRightArrow: HTMLElement;
  public navigationLeftArrow: HTMLElement;
  public showHeaderBar: Boolean = false;

  constructor() { 
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
    var startDate = new Date(2019, 9, 30);
    var today = new Date(2019, 11, 28);
    var diff = Math.abs(today.getTime() - startDate.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    console.log(diffDays);
    return Math.ceil(diffDays / 7);
  }
}