import {NgModule} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {TimeAdapter} from './time-adapter.service';
import {MAT_TIME_FORMATS} from './time-formats';
import {NativeTimeAdapter} from './native-time-adapter.service';
import {MAT_NATIVE_TIME_FORMATS} from './native-time-formats';

@NgModule({
  providers: [
    {provide: TimeAdapter, useClass: NativeTimeAdapter, deps: [MAT_DATE_LOCALE, DateAdapter]},
    {provide: MAT_TIME_FORMATS, useValue: MAT_NATIVE_TIME_FORMATS}
  ]
})
export class MatNativeTimeModule { }
