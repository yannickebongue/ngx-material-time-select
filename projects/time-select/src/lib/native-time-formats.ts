import {MatTimeFormats} from './time-formats';

export const MAT_NATIVE_TIME_FORMATS: MatTimeFormats = {
  parse: {
    timeInput: null
  },
  display: {
    timeInput: {hour: 'numeric', minute: 'numeric'},
    timeA11yLabel: {hour: 'numeric', minute: '2-digit'}
  }
};
