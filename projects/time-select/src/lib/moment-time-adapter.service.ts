import {Inject, Injectable, Optional} from '@angular/core';
import {DateAdapter} from '@angular/material';
import {MAT_TIME_LOCALE, TimeAdapter} from './time-adapter.service';
import {Moment} from 'moment';

import * as _moment from 'moment';

const moment = _moment;

/** Adapts Moment.js Dates for use with Angular Material. */
@Injectable()
export class MomentTimeAdapter extends TimeAdapter<Moment> {

  constructor(@Optional() @Inject(MAT_TIME_LOCALE) locale: string,
              @Optional() private _dateAdapter: DateAdapter<Moment>) {
    super();
    this.setLocale(locale || moment.locale());
  }

  getYear(date: Moment): number {
    return this.clone(date).year();
  }

  getMonth(date: Moment): number {
    return this.clone(date).month();
  }

  getDate(date: Moment): number {
    return this.clone(date).date();
  }

  getDayOfWeek(date: Moment): number {
    return this.clone(date).day();
  }

  getHour(date: Moment): number {
    return this.clone(date).hour();
  }

  getMinute(date: Moment): number {
    return this.clone(date).minute();
  }

  getSecond(date: Moment): number {
    return this.clone(date).second();
  }

  clone(date: Moment): Moment {
    return date.clone().locale(this.locale);
  }

  createDate(year: number, month: number, date: number): Moment {
    return this.clone(this._dateAdapter.createDate(year, month, date));
  }

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

    return moment({hour, minute, second}).locale(this.locale);
  }

  today(): Moment {
    return this.now();
  }

  now(): Moment {
    return moment().locale(this.locale);
  }

  parse(value: any, parseFormat: string): Moment | null {
    if (value && typeof value === 'string') {
      return moment(value, parseFormat, this.locale);
    }
    return value ? moment(value).locale(this.locale) : null;
  }

  format(date: Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw new Error('MomentTimeAdapter: Cannot format invalid date.');
    }
    return date.format(displayFormat);
  }

  addCalendarYears(date: Moment, years: number): Moment {
    return this.clone(date).add({years});
  }

  addCalendarMonths(date: Moment, months: number): Moment {
    return this.clone(date).add({months});
  }

  addCalendarDays(date: Moment, days: number): Moment {
    return this.clone(date).add({days});
  }

  toIso8601(date: Moment): string {
    return this.clone(date).format();
  }

  toMoment(date: Moment): Moment {
    return this.clone(date);
  }

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
    return super.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  isValid(date: Moment): boolean {
    return this.clone(date).isValid();
  }

  invalid(): Moment {
    return moment.invalid();
  }

  getDateNames(): string[] {
    return [];
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return [];
  }

  getFirstDayOfWeek(): number {
    return 0;
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return [];
  }

  getNumDaysInMonth(date: Moment): number {
    return 0;
  }

  getYearName(date: Moment): string {
    return '';
  }

}
