import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreferencesWelcomeComponent } from 'src/preferences-welcome/preferences-welcome.component';

const routes: Routes = [
  {path: 'preferencesWelcome', component: PreferencesWelcomeComponent}
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
