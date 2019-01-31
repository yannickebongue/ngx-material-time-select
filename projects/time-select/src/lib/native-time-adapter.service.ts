import {Inject, Injectable, Optional} from '@angular/core';
import {DateAdapter} from '@angular/material';
import {MAT_TIME_LOCALE, TimeAdapter} from './time-adapter.service';
import {Moment} from 'moment';

import * as _moment from 'moment';

const moment = _moment;

/** Adapts the native JS Date for use with cdk-based components that work with times. */
@Injectable()
export class NativeTimeAdapter extends TimeAdapter<Date> {

  constructor(@Optional() @Inject(MAT_TIME_LOCALE) locale: string,
              @Optional() private _dateAdapter: DateAdapter<Date>) {
    super();
    this.setLocale(locale);
  }

  getYear(date: Date): number {
    return this._dateAdapter.getYear(date);
  }

  getMonth(date: Date): number {
    return this._dateAdapter.getMonth(date);
  }

  getDate(date: Date): number {
    return this._dateAdapter.getDate(date);
  }

  getDayOfWeek(date: Date): number {
    return this._dateAdapter.getDayOfWeek(date);
  }

  getHour(date: Date): number {
    return date.getHours();
  }

  getMinute(date: Date): number {
    return date.getMinutes();
  }

  getSecond(date: Date): number {
    return date.getSeconds();
  }

  getYearName(date: Date): string {
    return this._dateAdapter.getYearName(date);
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return this._dateAdapter.getMonthNames(style);
  }

  getDateNames(): string[] {
    return this._dateAdapter.getDateNames();
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return this._dateAdapter.getDayOfWeekNames(style);
  }

  getFirstDayOfWeek(): number {
    return this._dateAdapter.getFirstDayOfWeek();
  }

  getNumDaysInMonth(date: Date): number {
    return this._dateAdapter.getNumDaysInMonth(date);
  }

  clone(date: Date): Date {
    return new Date(date.getTime());
  }

  createDate(year: number, month: number, date: number): Date {
    return this._dateAdapter.createDate(year, month, date);
  }

  createTime(hour: number = 0, minute: number = 0, second: number = 0): Date {
    if (hour < 0 || hour > 23) {
      throw new Error(`Invalid hour ${hour}. Hour has to be between 0 and 23.`);
    }

    if (minute < 0 || minute > 59) {
      throw new Error(`Invalid minute ${minute}. Minute has to be between 0 and 59.`);
    }

    if (second < 0 || second > 59) {
      throw new Error(`Invalid second ${second}. Second has to be between 0 and 59.`);
    }

    const date = new Date();
    date.setHours(hour,  minute, second);
    return date;
  }

  today(): Date {
    return this.now();
  }

  now(): Date {
    return new Date(Date.now());
  }

  parse(value: any, parseFormat: any): Date | null {
    return this._dateAdapter.parse(value, parseFormat);
  }

  format(date: Date, displayFormat: any): string {
    return this._dateAdapter.format(date, displayFormat);
  }

  addCalendarYears(date: Date, years: number): Date {
    return this._dateAdapter.addCalendarYears(date, years);
  }

  addCalendarMonths(date: Date, months: number): Date {
    return this._dateAdapter.addCalendarMonths(date, months);
  }

  addCalendarDays(date: Date, days: number): Date {
    return this._dateAdapter.addCalendarDays(date, days);
  }

  toIso8601(date: Date): string {
    const dateString = this._dateAdapter.toIso8601(date);
    const timeString = [
      this._2digit(date.getUTCHours()),
      this._2digit(date.getUTCMinutes()),
      this._2digit(date.getUTCSeconds())
    ].join(':');
    return `${dateString}T${timeString}Z`;
  }

  toMoment(date: Date): Moment {
    return moment(date).locale(this.locale);
  }

  deserialize(value: any): Date | null {
    return this._dateAdapter.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    return this._dateAdapter.isDateInstance(obj);
  }

  isValid(date: Date): boolean {
    return this._dateAdapter.isValid(date);
  }

  invalid(): Date {
    return this._dateAdapter.invalid();
  }

  /**
   * Pads a number to make it two digits.
   * @param n The number to pad.
   * @returns The padded number.
   */
  private _2digit(n: number) {
    return ('00' + n).slice(-2);
  }

}
