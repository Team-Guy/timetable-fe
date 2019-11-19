import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHoursPageComponent } from './select-hours-page.component';

describe('SelectHoursPageComponent', () => {
  let component: SelectHoursPageComponent;
  let fixture: ComponentFixture<SelectHoursPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectHoursPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectHoursPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
