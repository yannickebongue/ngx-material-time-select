import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  InjectionToken,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  Provider,
  QueryList,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Directionality} from '@angular/cdk/bidi';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {ESCAPE, UP_ARROW} from '@angular/cdk/keycodes';
import {Overlay, OverlayConfig, OverlayRef, PositionStrategy, ScrollStrategy} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {CanColor, CanColorCtor, mixinColor, ThemePalette} from '@angular/material';
import {merge, Observable, Subject, Subscription} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {DurationInputArg1, DurationInputArg2, Moment, unitOfTime} from 'moment';
import {TimeAdapter} from './time-adapter.service';
import {createMissingTimeImplError} from './time-select-errors';
import {MatTimeSelectIntl} from './time-select-intl.service';
import {MatTimeSelectInputDirective} from './time-select-input.directive';
import {MatTimeUnitSelectComponent} from './time-unit-select.component';

/** Used to generate a unique ID for each time select instance. */
let timeSelectUid = 0;

/** Injection token used to initialize the time select data. */
export const MAT_TIME_SELECT_DATA = new InjectionToken<Moment>('mat-time-select-data');

/** Injection token that determines the scroll handling while the time select is opened. */
export const MAT_TIME_SELECT_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>('mat-time-select-scroll-strategy');

/** @docs-private */
export function MAT_TIME_SELECT_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const MAT_TIME_SELECT_SCROLL_STRATEGY_FACTORY_PROVIDER: Provider = {
  provide: MAT_TIME_SELECT_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: MAT_TIME_SELECT_SCROLL_STRATEGY_FACTORY
};

export interface MatTimeSelectData<D> {
  units?: unitOfTime.All[];
  value?: D;
  minTime?: D;
  maxTime?: D;
}

/** @docs-private */
export class MatTimeSelectContentBase {

  constructor(public _elementRef: ElementRef) { }

}

export const _MatTimeSelectContentMixinBase: CanColorCtor & typeof MatTimeSelectContentBase =
  mixinColor(MatTimeSelectContentBase);

/**
 * Component used as the content for the time select popup.
 * @docs-private
 */
@Component({
  selector: 'mat-time-select-content',
  templateUrl: './time-select-content.component.html',
  styleUrls: ['./time-select-content.component.scss'],
  exportAs: 'matTimeSelectContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatTimeSelectContentComponent<D> extends _MatTimeSelectContentMixinBase implements CanColor {

  /** @docs-private */
  @Input() color: ThemePalette;
  /** The array of unit of time selectable in the time select content. */
  @Input() units: unitOfTime.All[];
  /** The currently selected time of the time select content. */
  @Input() value: Moment;
  /** The minimum selectable time. */
  @Input() minTime: Moment;
  /** The minimum selectable time. */
  @Input() maxTime: Moment;

  /** Emits when the time select content selected time has been changed. */
  @Output() valueChange: EventEmitter<Moment> = new EventEmitter<Moment>();

  /** Reference to the internal time unit select components. */
  @ViewChildren(MatTimeUnitSelectComponent) timeUnitSelectComponents: QueryList<MatTimeUnitSelectComponent<D>>;

  /** @docs-private */
  @HostBinding('class') readonly class = 'mat-time-select-content';

  /** The hour clock type. Possible values: 12: 12 hour clock; 24: 24 hour clock */
  hourClock: number;

  /**
   * The time period of the currently selected time of the time select content. Possible values: `am` when selected time hour is less
   * than 12; `pm` when selected time hour is greater than or equal to 12.
   */
  get amPm(): string { return this.value ? (this.value.hour() < 12 ? 'am' : 'pm') : null; }
  set amPm(value: string) {
    if (this.timeUnitSelectComponents) {
      this.timeUnitSelectComponents.toArray()
        .filter(timeSelect => timeSelect.unit === 'hour')
        .forEach(timeSelect => timeSelect.move(value === 'am' ? -12 : 12));
    }
  }

  constructor(elementRef: ElementRef,
              public _intl: MatTimeSelectIntl,
              @Optional() private _timeAdapter: TimeAdapter<D>,
              @Optional() @Inject(MAT_TIME_SELECT_DATA) data: MatTimeSelectData<D>) {
    super(elementRef);

    if (!this._timeAdapter) {
      throw createMissingTimeImplError('TimeAdapter');
    }

    const time = this._timeAdapter.isDateInstance(data.value) && this._timeAdapter.isValid(data.value) ?
      this._timeAdapter.clone(data.value) : this._timeAdapter.now();
    const value = this._timeAdapter.toMoment(this._timeAdapter.clampTime(time, data.minTime, data.maxTime));
    const localeData = value.localeData();
    const displayFormat = localeData.longDateFormat('LTS');
    this.hourClock = /hh?/g.test(displayFormat) ? 12 : 24;
    this.value = value;
    this.units = data.units || ['hour', 'minute'];
    this.minTime = data.minTime ? this._timeAdapter.toMoment(data.minTime) : null;
    this.maxTime = data.maxTime ? this._timeAdapter.toMoment(data.maxTime) : null;
  }

  /**
   * Gets the value of the given unit of time.
   * @param unit The unit of time to query.
   * @returns The retrieved value.
   */
  get(unit: unitOfTime.All): number {
    return this.value.get(unit);
  }

  /**
   * Sets the value of the given unit of time.
   * @param unit The unit of time to update.
   * @param value The value to set.
   */
  set(unit: unitOfTime.All, value: number) {
    this.value.set(unit, value);
    this.valueChange.emit(this.value);
  }

  /**
   * Gets the minimum allowed value of the given unit of time.
   * @param unit The unit of time to query.
   * @returns The minimum value.
   */
  getMin(unit: unitOfTime.All): number | null {
    let min = null;
    if (this.minTime && this.value.isSame(this.minTime, 'day')) {
      if (this.getPrev(unit).isBefore(this.minTime)) {
        min = this.value.get(unit);
      }
      if (this.getNext(unit).isBefore(this.minTime)) {
        min = this.minTime.get(unit);
      }
    }
    return min;
  }

  /**
   * Gets the maximum allowed value of the given unit of time.
   * @param unit The unit of time to query.
   * @returns The maximum value.
   */
  getMax(unit: unitOfTime.All): number | null {
    let max = null;
    if (this.maxTime && this.value.isSame(this.maxTime, 'day')) {
      if (this.getNext(unit).isAfter(this.maxTime)) {
        max = this.value.get(unit);
      }
      if (this.getPrev(unit).isAfter(this.maxTime)) {
        max = this.maxTime.get(unit);
      }
    }
    return max;
  }

  /**
   * Gets the value after moving up the given unit of time.
   * @param unit The unit of time to move.
   * @returns The new value.
   */
  getPrev(unit: unitOfTime.All): Moment {
    const prev = this.value.clone().subtract(1 as DurationInputArg1, unit as DurationInputArg2);
    return this.value.clone().set(unit, prev.get(unit));
  }

  /**
   * Gets the value after moving down the given unit of time.
   * @param unit The unit of time to move.
   * @returns The new value.
   */
  getNext(unit: unitOfTime.All): Moment {
    const next = this.value.clone().add(1 as DurationInputArg1, unit as DurationInputArg2);
    return this.value.clone().set(unit, next.get(unit));
  }

  /**
   * Gets the value before midday.
   */
  getAM(): Moment {
    if (this.value.hour() >= 12) {
      return this.value.clone().subtract(12, 'hour');
    }
    return this.value;
  }

  /**
   * Gets the value after midday.
   */
  getPM(): Moment {
    if (this.value.hour() < 12) {
      return this.value.clone().add(12, 'hour');
    }
    return this.value;
  }

  /**
   * Whether the given value is selectable.
   * @param value The value to check.
   * @returns `true` if the value is valid. Otherwise `false`.
   */
  isValid(value: Moment): boolean {
    const beforeMin = this.minTime && value.isBefore(this.minTime);
    const afterMax = this.maxTime && value.isAfter(this.maxTime);
    return !(beforeMin || afterMax);
  }

}

/** Component responsible for managing the time select popup. */
@Component({
  selector: 'mat-time-select',
  template: '',
  exportAs: 'matTimeSelect',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatTimeSelectComponent<D> implements OnDestroy, CanColor {

  /** Subscription to value changes in the associated input element. */
  private _inputSubscription = Subscription.EMPTY;

  private _startAt: D | null;
  private _color: ThemePalette;
  private _disabled: boolean;
  private _selected: D;
  private _opened = false;

  private _disabledChange: Subject<boolean> = new Subject<boolean>();
  private _selectedChange: Subject<D> = new Subject<D>();

  /** A reference to the overlay when the time select is opened as a popup. */
  private _popupRef: OverlayRef;
  /** A portal containing the popup for this time select. */
  private _popupComponentPortal: ComponentPortal<MatTimeSelectContentComponent<D>>;
  /** Reference to the component instantiated in popup mode. */
  private _popupComponentRef: ComponentRef<MatTimeSelectContentComponent<D>>;
  /** The element that was focused before the time select was opened. */
  private _focusedElementBeforeOpen: HTMLElement | null = null;

  private readonly _scrollStrategy: () => ScrollStrategy;

  /** The input element this time select is associated with. */
  _timeSelectInput: MatTimeSelectInputDirective<D>;

  /** Emits when the time select has been opened. */
  @Output('open') openStream: EventEmitter<void> = new EventEmitter<void>();
  /** Emits when the time select has been closed. */
  @Output('close') closeStream: EventEmitter<void> = new EventEmitter<void>();

  /** The id for the time select popup. */
  id = `mat-time-select-${timeSelectUid++}`;

  /** The initial time of the time select. */
  @Input()
  get startAt(): D | null { return this._startAt || (this._timeSelectInput ? this._timeSelectInput.value : null); }
  set startAt(value: D | null) { this._startAt = this._getValidDateOrNull(this._timeAdapter.deserialize(value)); }

  /** The color palette to use on the time select popup. */
  @Input()
  get color(): ThemePalette { return this._color || (this._timeSelectInput ? this._timeSelectInput.getThemePalette() : undefined); }
  set color(value: ThemePalette) { this._color = value; }

  /** Whether the time select pop-up should disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled !== undefined ? this._disabled : (this._timeSelectInput ? this._timeSelectInput.disabled : false);
  }
  set disabled(value: boolean) {
    const disabled = coerceBooleanProperty(value);
    if (this._disabled !== disabled) {
      this._disabled = disabled;
      this._disabledChange.next(disabled);
    }
  }

  /** The currently selected time. */
  @Input()
  get selected(): D { return this._selected; }
  set selected(value: D) { this._selected = value; }

  /** Whether the time select is opened. */
  @Input()
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { value ? this.open() : close(); }

  /** Emits when the time select disabled state has been changed. */
  get disabledChange(): Observable<boolean> { return this._disabledChange.asObservable(); }
  /** Emits when the time select selected time has been changed. */
  get selectedChange(): Observable<D> { return this._selectedChange.asObservable(); }

  constructor(private _overlay: Overlay,
              private _injector: Injector,
              private _ngZone: NgZone,
              private _viewContainerRef: ViewContainerRef,
              @Inject(MAT_TIME_SELECT_SCROLL_STRATEGY) scrollStrategy: any,
              @Optional() private _timeAdapter: TimeAdapter<D>,
              @Optional() private _dir: Directionality,
              @Optional() @Inject(DOCUMENT) private _document: any) {
    if (!this._timeAdapter) {
      throw createMissingTimeImplError('TimeAdapter');
    }

    this._scrollStrategy = scrollStrategy;
  }

  ngOnDestroy() {
    this.close();
    this._inputSubscription.unsubscribe();
    this._disabledChange.complete();

    if (this._popupRef) {
      this._popupRef.dispose();
      this._popupComponentRef = null;
    }
  }

  /**
   * Selects the given time.
   * @param time The date time to select.
   */
  select(time: D) {
    const oldValue = this.selected;
    const value = this._timeAdapter.clone(time);
    this.selected = value;
    if (!this._timeAdapter.sameTime(oldValue, value)) {
      this._selectedChange.next(value);
    }
  }

  /**
   * Register an input with this time select.
   * @param input The time select input to register with this time select.
   */
  registerInput(input: MatTimeSelectInputDirective<D>) {
    if (this._timeSelectInput) {
      throw Error('A MatTimeSelect can only be associated with a single input.');
    }
    this._timeSelectInput = input;
    this._inputSubscription = this._timeSelectInput.valueChange.subscribe((value: D | null) => this.selected = value);
  }

  /** Open the time select. */
  open() {
    if (this._opened || this.disabled) {
      return;
    }
    if (!this._timeSelectInput) {
      throw Error('Attempted to open an MatTimeSelect with no associated input.');
    }
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }

    this._openAsPopup();
    this._opened = true;
    this.openStream.emit();
  }

  /** Close the time select. */
  close() {
    if (!this._opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._popupComponentPortal && this._popupComponentPortal.isAttached) {
      this._popupComponentPortal.detach();
    }

    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this._opened) {
        this._opened = false;
        this.closeStream.emit();
        this._focusedElementBeforeOpen = null;
      }
    };

    if (this._focusedElementBeforeOpen && typeof this._focusedElementBeforeOpen.focus === 'function') {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the time select as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the time select on focus, the user could be stuck with not being
      // able to close the select panel at all. We work around it by making the logic, that marks
      // the time select as closed, async as well.
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  /** Open the time select as a popup. */
  private _openAsPopup(): void {
    this._popupComponentPortal = new ComponentPortal<MatTimeSelectContentComponent<D>>(
      MatTimeSelectContentComponent,
      this._viewContainerRef,
      this._createInjector()
    );

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      this._popupComponentRef = this._popupRef.attach(this._popupComponentPortal);
      this._popupComponentRef.instance.valueChange.subscribe(
        (value: Moment) => this.select(this._timeAdapter.deserialize(value.toISOString()))
      );
      this._setColor();

      // Update the position once the select panel has rendered.
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this._popupRef.updatePosition();
      });
    }
  }

  /** Create a portal injector to inject time select initial data. */
  private _createInjector(): PortalInjector {
    const data: MatTimeSelectData<D> = {
      value: this.startAt,
      minTime: this._timeSelectInput && this._timeSelectInput.min,
      maxTime: this._timeSelectInput && this._timeSelectInput.max
    };
    const injectorTokens = new WeakMap<any, any>([
      [MAT_TIME_SELECT_DATA, data]
    ]);
    return new PortalInjector(this._injector, injectorTokens);
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      direction: this._dir,
      scrollStrategy: this._scrollStrategy(),
      panelClass: 'mat-time-select-popup',
    });

    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this._popupRef.backdropClick(),
      this._popupRef.detachments(),
      this._popupRef.keydownEvents().pipe(filter(event => {
        // Closing on alt + up is only valid when there's an input associated with the time select.
        return event.keyCode === ESCAPE ||
          (this._timeSelectInput && event.altKey && event.keyCode === UP_ARROW);
      }))
    ).subscribe(() => this.close());
  }

  /** Create the popup position strategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .flexibleConnectedTo(this._timeSelectInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.mat-time-select-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return this._timeAdapter.isDateInstance(obj) && this._timeAdapter.isValid(obj) ? obj : null;
  }

  /** Passes the current theme color along to the time select overlay. */
  private _setColor(): void {
    if (this._popupComponentRef) {
      this._popupComponentRef.instance.color = this.color;
    }
  }

}
