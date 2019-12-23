import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {Router} from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SelectGroupPageComponent } from './select-group-page/select-group-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { OptimizationFlowComponent } from './optimization-flow/optimization-flow.component';
import { AuthGuardService } from './guards/auth-guard.service';

const appRoutes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'selectgroup', component: SelectGroupPageComponent, canActivate: [AuthGuardService]},
  {path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuardService]},
  {path: 'timetable', component: CalendarPageComponent, canActivate: [AuthGuardService]},
  {path: 'optimize-schedule', component: OptimizationFlowComponent, canActivate: [AuthGuardService]},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(
      appRoutes
    ),
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
  constructor(private router: Router) {}
 }

export const routingComponents = [
  LoginPageComponent,
  SelectGroupPageComponent,
  CalendarPageComponent,
  OptimizationFlowComponent,
  CalendarPageComponent,
  ProfilePageComponent]
