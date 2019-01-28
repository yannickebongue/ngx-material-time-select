import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

/** TimeSelect data that requires internationalization. */
@Injectable()
export class MatTimeSelectIntl {

  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();

  /** A label for the button used to open the time select popup (used by screen readers). */
  openTimeSelectLabel = 'Open time select';

  /** A label for the a.m. button toggle (used by screen readers). */
  amLabel = 'AM';

  /** A label for the p.m. button toggle (used by screen readers). */
  pmLabel = 'PM';

}
