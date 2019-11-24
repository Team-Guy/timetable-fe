import { Component, OnInit } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import { EventSettingsModel, DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService } from '@syncfusion/ej2-angular-schedule';
import { scheduleData } from './data';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService]
})
export class CalendarPageComponent implements OnInit {
  public selectedDate: Date = new Date(2019, 0, 10);
  public eventSettings: EventSettingsModel = { dataSource: <Object[]>extend([], scheduleData, null, true) };
  constructor() { }

  ngOnInit() {
  }

}