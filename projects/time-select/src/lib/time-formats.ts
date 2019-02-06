import {InjectionToken} from '@angular/core';

export interface MatTimeFormats {
  parse: {
    timeInput: any
  };
  display: {
    timeInput: any
    timeA11yLabel: any
  };
}

export const MAT_TIME_FORMATS = new InjectionToken<MatTimeFormats>('mat-time-formats');
