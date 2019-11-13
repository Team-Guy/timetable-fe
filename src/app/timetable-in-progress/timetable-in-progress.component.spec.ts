import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableInProgressComponent } from './timetable-in-progress.component';

describe('TimetableInProgressComponent', () => {
  let component: TimetableInProgressComponent;
  let fixture: ComponentFixture<TimetableInProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetableInProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
