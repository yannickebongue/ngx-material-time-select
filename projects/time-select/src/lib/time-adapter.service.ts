import {DateAdapter} from '@angular/material';
import {Moment} from 'moment';

/** Adapts date object to be usable as a date time by cdk-based components that work with dates. */
export abstract class TimeAdapter<D> extends DateAdapter<D> {

  /**
   * Gets the hour component of the given date.
   * @param date The date to extract the hour from.
   * @returns The hour component (0-indexed, 0 = midnight).
   */
  abstract getHour(date: D): number;

  /**
   * Gets the minute component of the given date.
   * @param date The date to extract the minute from.
   * @returns The minute component (0-indexed, 0 = start of hour).
   */
  abstract getMinute(date: D): number;

  /**
   * Gets the second component of the given date.
   * @param date The date to extract the second from.
   * @returns The second component (0-indexed, 0 = start of minute).
   */
  abstract getSecond(date: D): number;

  /**
   * Create a date with the given hour, minute and second. Does not allow over/under-flow of the
   * hour, minute and second.
   * @param hour The hour of the date. Must be an integer 0 - 23.
   * @param minute The minute of the date. Must be an integer 0 - 59.
   * @param second The second of the date. Must be an integer 0 - 59.
   * @returns The new date.
   */
  abstract createTime(hour?: number, minute?: number, second?: number): D;

  /**
   * Gets the current date.
   * @returns The current date.
   */
  abstract now(): D;

  /**
   * Convert the given date to a Moment object.
   * @param date the date object to convert.
   */
  abstract toMoment(date: D): Moment;

  /**
   * Compares two date times.
   * @param first The first date to compare.
   * @param second The second date to compare.
   * @returns 0 if the date times are equal, a number less than 0 if the first date time is earlier,
   *     a number greater than 0 if the first date time is later.
   */
  compareTime(first: D, second: D): number {
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
  sameTime(first: D | null, second: D | null): boolean {
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
  clampTime(date: D, min?: D | null, max?: D | null): D {
    if (min && this.compareTime(date, min) < 0) {
      return min;
    }
    if (max && this.compareTime(date, max) > 0) {
      return max;
    }
    return date;
  }

}
