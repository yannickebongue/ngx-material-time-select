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

export const MAT_TIME_FORMATS = new InjectionToken<MatTimeFormats>('mat-time-formats', {
  providedIn: 'root',
  factory: MAT_TIME_FORMATS_FACTORY
});

export function MAT_TIME_FORMATS_FACTORY(): MatTimeFormats {
  return {
    parse: {
      timeInput: 'LT'
    },
    display: {
      timeInput: 'LT',
      timeA11yLabel: 'LT'
    }
  };
}
