import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimetableInProgressComponent } from '../timetable-in-progress/timetable-in-progress.component';

const routes: Routes = [
  {path: 'inProgress', component: TimetableInProgressComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
