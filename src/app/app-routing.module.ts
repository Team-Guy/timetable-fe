import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SelectGroupPageComponent } from './select-group-page/select-group-page.component';
import { PreferencesPageComponent } from './preferences-page/preferences-page.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'selectgroup', component: SelectGroupPageComponent},
  {path: 'preferences', component: PreferencesPageComponent},
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
  constructor(private router: Router){}
 }

export const routingComponents = [LoginPageComponent, SelectGroupPageComponent, PreferencesPageComponent]
