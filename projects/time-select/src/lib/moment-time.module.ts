import {NgModule} from '@angular/core';
import {MAT_TIME_LOCALE, TimeAdapter} from './time-adapter.service';
import {MAT_TIME_FORMATS} from './time-formats';
import {MomentTimeAdapter} from './moment-time-adapter.service';
import {MAT_MOMENT_TIME_FORMATS} from './moment-time-formats';

@NgModule({
  providers: [
    {provide: TimeAdapter, useClass: MomentTimeAdapter, deps: [MAT_TIME_LOCALE]},
    {provide: MAT_TIME_FORMATS, useValue: MAT_MOMENT_TIME_FORMATS}
  ]
})
export class MatMomentTimeModule { }
