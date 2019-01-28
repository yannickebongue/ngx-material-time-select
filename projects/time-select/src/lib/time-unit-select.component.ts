import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DurationInputArg1, DurationInputArg2, unitOfTime} from 'moment';
import {TimeAdapter} from './time-adapter.service';
import {MAT_TIME_FORMATS, MatTimeFormats} from './time-formats';

/** Component used to select a value of a unit of time. */
@Component({
  selector: 'mat-time-unit-select',
  templateUrl: './time-unit-select.component.html',
  styleUrls: ['./time-unit-select.component.scss'],
  exportAs: 'matTimeSelect',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatTimeUnitSelectComponent implements AfterViewInit, OnInit {

  private _originTop: number;

  /** The currently selected value. */
  @Input() value: number;
  /** The unit of time of the time select. */
  @Input() unit: unitOfTime.All;

  /** The list of all values of the time select. */
  options: {value: number; label: string}[] = [];

  /** Emits when selected value has been changed. Output to enable support for two-way binding on `[(value)]`. */
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  /** The panel element containing all time select options. */
  @ViewChild('panel') panel: ElementRef<HTMLElement>;

  constructor(private _changeDetectorRef: ChangeDetectorRef,
              private _timeAdapter: TimeAdapter,
              @Inject(MAT_TIME_FORMATS) private _timeFormats: MatTimeFormats) { }

  ngOnInit() {
    const unit = this.unit;
    const time = this._timeAdapter.createTime();
    const start = this._timeAdapter.clone(time).startOf('day');
    const end = this._timeAdapter.clone(time).endOf('day');
    const min = start.get(unit);
    const max = end.get(unit);
    const localeData = time.localeData();
    const displayFormat = localeData.longDateFormat(this._timeFormats.display.timeInput);
    const unitFormat = unit === 'hour' ?
      displayFormat.match(/hh?|HH?/g)[0] : unit === 'minute' ?
        displayFormat.match(/mm?/g)[0] : displayFormat.match(/ss?/g)[0];
    time.set(unit, this.value);
    time.subtract(1 as DurationInputArg1, unit as DurationInputArg2);
    for (let value = min; value <= max; value++) {
      time.add(1 as DurationInputArg1, unit as DurationInputArg2);
      this.options.push({value: time.get(unit), label: time.format(unitFormat)});
    }
  }

  ngAfterViewInit() {
    const element = this.panel.nativeElement;
    this._originTop = parseFloat(getComputedStyle(element).top);
    element.addEventListener('transitionend', () => {
      element.style.removeProperty('transition');
    });
    setTimeout(() => this.move(this.options.length / 2));
  }

  /** Select the previous option. */
  prev() {
    this.move(-1);
  }

  /** Select the next option. */
  next() {
    this.move(+1);
  }

  /**
   * Select the option moving by the given amount of step.
   * @param step The amount of step to move.
   */
  move(step: number) {
    const element = this.panel.nativeElement;
    const option = element.querySelector('mat-time-unit-option');
    const optionHeight = parseFloat(getComputedStyle(option).height);
    const currentTop = parseFloat(getComputedStyle(element).top);
    const targetTop = currentTop + (step * optionHeight);
    const y = this._originTop - targetTop;

    element.style.top = `${targetTop}px`;

    if (step < 0) {
      // Move last option to the top
      for (let i = 0; i > step; i--) {
        this.options.unshift(this.options.pop());
      }
    } else if (step > 0) {
      // Move first option to the bottom
      for (let i = 0; i < step; i++) {
        this.options.push(this.options.shift());
      }
    }

    this.value = this.options[(this.options.length / 2)].value;
    this.valueChange.emit(this.value);

    element.style.transition = 'transform 0.5s';
    element.style.transform = `translateY(${y}px)`;
  }

}
