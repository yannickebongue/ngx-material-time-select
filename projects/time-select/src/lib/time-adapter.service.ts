import {Inject, Injectable, InjectionToken, LOCALE_ID, Optional, Provider} from '@angular/core';
import {Moment} from 'moment';
import {Observable, Subject} from 'rxjs';

import * as _moment from 'moment';

const moment = _moment;

/** InjectionToken for time select that can be used to override default locale code. */
export const MAT_TIME_LOCALE: InjectionToken<string> = new InjectionToken<string>('MAT_TIME_LOCALE');

/** @docs-private */
export const MAT_TIME_LOCALE_PROVIDER: Provider = {provide: MAT_TIME_LOCALE, useExisting: LOCALE_ID};

/** Adapts date object to be usable as a date time by cdk-based components that work with dates. */
@Injectable()
export class TimeAdapter {
  private _locale: any;
  private _localeChanges: Subject<void> = new Subject<void>();

  /** A stream that emits when the locale changes. */
  get localeChanges(): Observable<void> {
    return this._localeChanges;
  }

  constructor(@Optional() @Inject(MAT_TIME_LOCALE) locale: string) {
    this.setLocale(locale || moment.locale());
  }

  /**
   * Sets the locale used for all dates.
   * @param locale The new locale.
   */
  setLocale(locale: any) {
    this._locale = locale;
    this._localeChanges.next();
  }

  /**
   * Gets the hour component of the given date.
   * @param date The date to extract the hour from.
   * @returns The hour component (0-indexed, 0 = midnight).
   */
  getHour(date: Moment): number {
    return this.clone(date).hour();
  }

  /**
   * Gets the minute component of the given date.
   * @param date The date to extract the minute from.
   * @returns The minute component (0-indexed, 0 = start of hour).
   */
  getMinute(date: Moment): number {
    return this.clone(date).minute();
  }

  /**
   * Gets the second component of the given date.
   * @param date The date to extract the second from.
   * @returns The second component (0-indexed, 0 = start of minute).
   */
  getSecond(date: Moment): number {
    return this.clone(date).second();
  }

  /**
   * Clone the given date.
   * @param date The date to clone.
   * @returns A new date equal to the given date.
   */
  clone(date: Moment): Moment {
    return date.clone().locale(this._locale);
  }

  /**
   * Create a date with the given hour, minute and second. Does not allow over/under-flow of the
   * hour, minute and second.
   * @param hour The hour of the date. Must be an integer 0 - 23.
   * @param minute The minute of the date. Must be an integer 0 - 59.
   * @param second The second of the date. Must be an integer 0 - 59.
   * @returns The new date.
   */
  createTime(hour: number = 0, minute: number = 0, second: number = 0): Moment {
    if (hour < 0 || hour > 23) {
      throw new Error(`Invalid hour ${hour}. Hour has to be between 0 and 23.`);
    }

    if (minute < 0 || minute > 59) {
      throw new Error(`Invalid minute ${minute}. Minute has to be between 0 and 59.`);
    }

    if (second < 0 || second > 59) {
      throw new Error(`Invalid second ${second}. Second has to be between 0 and 59.`);
    }

    return moment({hour, minute, second}).locale(this._locale);
  }

  /**
   * Gets the current date.
   * @returns The current date.
   */
  now(): Moment {
    return moment().locale(this._locale);
  }

  /**
   * Parses a date from a user provided value.
   * @param value The value to parse.
   * @param parseFormat The expected format of the value being parsed.
   * @returns The parsed date.
   */
  parse(value: any, parseFormat: string): Moment | null {
    if (value && typeof value === 'string') {
      return moment(value, parseFormat, this._locale);
    }
    return value ? moment(value).locale(this._locale) : null;
  }

  /**
   * Formats a date as a string according to the given format.
   * @param date The value to format.
   * @param displayFormat The format to use to display the date as a string.
   * @returns The formatted date string.
   */
  format(date: Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw new Error('TimeAdapter: Cannot format invalid date.');
    }
    return date.format(displayFormat);
  }

  /**
   * Gets the RFC 3339 compatible string (https://tools.letf.org/html/rfc3339) for the given date.
   * This method is used to generate date strings that are compatible with native HTML attributes
   * such as the `min` or `max` attribute of an `<input>`.
   * @param date The date to get the ISO date string for.
   * @returns The ISO date string.
   */
  toIso8601(date: Moment): string {
    return this.clone(date).format();
  }

  /**
   * Attempts to deserialize a value to a valid date object. This is different from parsing in that
   * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
   * string). The default implementation does not allow any deserialization, it simply checks that
   * the given value is already a valid date object or null. The `<mat-time-select>` will call this
   * method on all of it's `@Input()` properties that accept dates. It is therefore possible to
   * support passing values from your backend directly to these properties by overriding this method
   * to also deserialize the format used by your backend.
   * @param value The value to be deserialized into a date object.
   * @returns The deserialized date object, either a valid date, null if the value can be
   *     deserialized into a null date (e.g. the empty string), or an invalid date.
   */
  deserialize(value: any): Moment | null {
    let date: Moment;
    if (value instanceof Date) {
      date = moment(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = moment(value, moment.ISO_8601);
    }
    if (date && this.isValid(date)) {
      return date;
    }
    if (this.isDateInstance(value) && this.isValid(value)) {
      return value;
    }
    return this.invalid();
  }

  /**
   * Checks whether the given object is considered a date instance by this TimeAdapter.
   * @param obj The object to check.
   * @returns Whether the object is a date instance.
   */
  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  /**
   * Checks whether the given date is valid.
   * @param date The date to check.
   * @returns Whether the date is valid.
   */
  isValid(date: Moment): boolean {
    return this.clone(date).isValid();
  }

  /**
   * Gets date instance that is not valid.
   * @returns An invalid date.
   */
  invalid(): Moment {
    return moment.invalid();
  }

  /**
   * Compares two date times.
   * @param first The first date to compare.
   * @param second The second date to compare.
   * @returns 0 if the date times are equal, a number less than 0 if the first date time is earlier,
   *     a number greater than 0 if the first date time is later.
   */
  compareTime(first: Moment, second: Moment): number {
    return this.getHour(first) - this.getHour(second) ||
      this.getMinute(first) - this.getMinute(second) ||
      this.getSecond(first) - this.getSecond(second);
  }

  /**
   * Checks if two date times are equal.
   * @param first The first date to check.
   * @param second The second date to check.
   * @returns Whether the two date times are equal.
   *     Null dates are considered equal to other null dates.
   */
  sameTime(first: Moment | null, second: Moment | null): boolean {
    if (first && second) {
      const firstValid = this.isValid(first);
      const secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !this.compareTime(first, second);
      }
      return firstValid === secondValid;
    }
    return first === second;
  }

  /**
   * Clamp the given date between min and max date times.
   * @param date The date to clamp.
   * @param min The minimum value to allow. If null or omitted no min is enforced.
   * @param max The maximum value to allow. If null or omitted no max is enforced.
   * @returns `min` if `date` is less than `min`, `max` if date is greater than `max`,
   *     otherwise `date`.
   */
  clampTime(date: Moment, min?: Moment | null, max?: Moment | null): Moment {
    if (min && this.compareTime(date, min) < 0) {
      return min;
    }
    if (max && this.compareTime(date, max) > 0) {
      return max;
    }
    return date;
  }

}
