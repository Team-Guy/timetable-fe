import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-group-page',
  templateUrl: './select-group-page.component.html',
  styleUrls: ['./select-group-page.component.css']
})
export class SelectGroupPageComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = ['931/1', '931/2', '932/1', '932/2', '933/1', '933/2', '226/1', '226/2', '227/1'];
  filteredOptions: Observable<string[]>;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    if (this.authService.getMenuDisplaySettings() === true) {
      this.router.navigate(['/timetable']);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  set() {
    this.authService.sendMessage({showMenu: true});
    this.authService.commitMenuDisplaySettings(true);
    this.router.navigate(['/timetable']);
  }

}
