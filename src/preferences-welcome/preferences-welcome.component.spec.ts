import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesWelcomeComponent } from './preferences-welcome.component';

describe('PreferencesWelcomeComponent', () => {
  let component: PreferencesWelcomeComponent;
  let fixture: ComponentFixture<PreferencesWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferencesWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
