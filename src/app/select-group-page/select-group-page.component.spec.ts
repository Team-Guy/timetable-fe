import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGroupPageComponent } from './select-group-page.component';

describe('SelectGroupPageComponent', () => {
  let component: SelectGroupPageComponent;
  let fixture: ComponentFixture<SelectGroupPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGroupPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
