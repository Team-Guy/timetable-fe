import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule,MatInputModule,MatMenuModule,MatToolbarModule,MatExpansionModule,MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { AngularFireAuth } from '@angular/fire/auth';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { MaskedTextBoxModule, UploaderAllModule } from '@syncfusion/ej2-angular-inputs';
import { ToolbarAllModule, ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonAllModule } from '@syncfusion/ej2-angular-buttons';
import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    CalendarPageComponent,
    NavbarComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatExpansionModule,
    MatCheckboxModule,
    RouterModule,

    CommonModule, 
    HttpModule, 
    ScheduleAllModule, 
    RecurrenceEditorAllModule,   
    NumericTextBoxAllModule, 
    DatePickerAllModule, 
    TimePickerAllModule, 
    DateTimePickerAllModule, 
    CheckBoxAllModule, 
    ToolbarAllModule,   
    DropDownListAllModule, 
    ContextMenuAllModule, 
    MaskedTextBoxModule, 
    UploaderAllModule, 
    MultiSelectAllModule, 
    TreeViewModule, 
    ButtonAllModule
  ],
  providers: [],
  bootstrap: [AppComponent, NavbarComponent]
})
export class AppModule { }
