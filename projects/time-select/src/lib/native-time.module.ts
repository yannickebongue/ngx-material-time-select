import {NgModule} from '@angular/core';
import {MAT_TIME_LOCALE, TimeAdapter} from './time-adapter.service';
import {MAT_TIME_FORMATS} from './time-formats';
import {NativeTimeAdapter} from './native-time-adapter.service';
import {MAT_NATIVE_TIME_FORMATS} from './native-time-formats';

@NgModule({
  providers: [
    {provide: TimeAdapter, useClass: NativeTimeAdapter, deps: [MAT_TIME_LOCALE]},
    {provide: MAT_TIME_FORMATS, useValue: MAT_NATIVE_TIME_FORMATS}
  ]
})
export class MatNativeTimeModule { }
