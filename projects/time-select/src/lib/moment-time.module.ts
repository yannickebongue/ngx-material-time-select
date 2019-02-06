import {NgModule} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {TimeAdapter} from './time-adapter.service';
import {MAT_TIME_FORMATS} from './time-formats';
import {MomentTimeAdapter} from './moment-time-adapter.service';
import {MAT_MOMENT_TIME_FORMATS} from './moment-time-formats';

@NgModule({
  providers: [
    {provide: TimeAdapter, useClass: MomentTimeAdapter, deps: [MAT_DATE_LOCALE, DateAdapter]},
    {provide: MAT_TIME_FORMATS, useValue: MAT_MOMENT_TIME_FORMATS}
  ]
})
export class MatMomentTimeModule { }
