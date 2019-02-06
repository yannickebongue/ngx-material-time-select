import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OverlayModule} from '@angular/cdk/overlay';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {MatTimeSelectModule} from '../../projects/time-select/src/lib/time-select.module';
import {MatNativeTimeModule} from '../../projects/time-select/src/lib/native-time.module';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {TimeSelectDemoComponent} from './time-select-demo/time-select-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    TimeSelectDemoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    OverlayModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTimeSelectModule,
    MatNativeTimeModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
