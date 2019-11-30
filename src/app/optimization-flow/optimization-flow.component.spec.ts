import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationFlowComponent } from './optimization-flow.component';

describe('OptimizationFlowComponent', () => {
  let component: OptimizationFlowComponent;
  let fixture: ComponentFixture<OptimizationFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
