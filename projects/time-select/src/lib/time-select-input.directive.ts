import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {DOWN_ARROW} from '@angular/cdk/keycodes';
import {MAT_INPUT_VALUE_ACCESSOR, MatFormField, ThemePalette} from '@angular/material';
import {Observable, Subject, Subscription} from 'rxjs';
import {Moment} from 'moment';
import {TimeAdapter} from './time-adapter.service';
import {MAT_TIME_FORMATS, MatTimeFormats} from './time-formats';
import {MatTimeSelectComponent} from './time-select.component';

/**
 * An event used for time select input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatTimeSelectInputEvent instead.
 */
export class MatTimeSelectInputEvent {

  /** The new value for the target time select input. */
  value: Moment;

  constructor(
    /** Reference to the time select input component that emitted the event. */
    public target: MatTimeSelectInputDirective,
    /** Reference to the native input element associated with the time select input. */
    public targetElement: HTMLElement) {
    this.value = this.target.value;
  }

}

/** Directive used to connect an input to a MatTimeSelectComponent. */
@Directive({
  selector: 'input[matTimeSelect]',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MatTimeSelectInputDirective), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => MatTimeSelectInputDirective), multi: true},
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatTimeSelectInputDirective}
  ],
  exportAs: 'matTimeSelectInput'
})
export class MatTimeSelectInputDirective implements OnDestroy, ControlValueAccessor, Validator {

  private _timeSelectSubscription = Subscription.EMPTY;
  private _localeSubscription: Subscription = Subscription.EMPTY;

  private _timeSelect: MatTimeSelectComponent;

  private _value: Moment;
  private _min: Moment;
  private _max: Moment;
  private _disabled: boolean;

  private _valueChange: Subject<Moment | null> = new Subject<Moment | null>();
  private _disabledChange: Subject<boolean> = new Subject<boolean>();

  /** The form control validator for whether the input parses. */
  private readonly _parseValidator: ValidatorFn;
  /** The form control validator for the min date time. */
  private readonly _minValidator: ValidatorFn;
  /** The form control validator for the max date time. */
  private readonly _maxValidator: ValidatorFn;
  /** The combined form control validator for this input. */
  private readonly _validator: ValidatorFn | null;

  /** Whether the last value set on the input was valid. */
  private _lastValueValid: boolean;

  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() readonly timeChange: EventEmitter<MatTimeSelectInputEvent> = new EventEmitter<MatTimeSelectInputEvent>();
  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() readonly timeInput: EventEmitter<MatTimeSelectInputEvent> = new EventEmitter<MatTimeSelectInputEvent>();

  /** Emits when the value changes (either due to user input or programmatic change). */
  valueChange: Observable<Moment | null> = this._valueChange.asObservable();
  /** Emits when the disabled state has changed. */
  disabledChange: Observable<boolean> = this._disabledChange.asObservable();

  private _onChange: (value: any) => void = () => {};
  private _onTouched: () => void = () => {};
  private _onValidatorChange: () => void = () => {};

  /** The time select that this input is associated with. */
  @Input()
  set matTimeSelect(value: MatTimeSelectComponent) {
    if (!value) {
      return;
    }

    this._timeSelect = value;
    this._timeSelect.registerInput(this);
    this._timeSelectSubscription.unsubscribe();

    this._timeSelectSubscription = this._timeSelect.selectedChange.subscribe((selected: Moment) => {
      this.value = selected;
      this._onChange(selected);
      this._onTouched();
      this.timeInput.emit(new MatTimeSelectInputEvent(this, this._elementRef.nativeElement));
      this.timeChange.emit(new MatTimeSelectInputEvent(this, this._elementRef.nativeElement));
    });
  }

  /** The value of the input. */
  @Input()
  get value(): Moment | null { return this._value; }
  set value(value: Moment | null) {
    value = this._timeAdapter.deserialize(value);
    this._lastValueValid = !value || this._timeAdapter.isValid(value);
    value = this._getValidDateOrNull(value);
    const oldValue = this._value;
    this._value = value;
    this._formatValue(value);

    if (!this._timeAdapter.sameTime(oldValue, value)) {
      this._valueChange.next(value);
    }
  }

  /** The minimum valid date time. */
  @Input()
  get min(): Moment | null { return this._min; }
  set min(value: Moment | null) {
    this._min = this._getValidDateOrNull(this._timeAdapter.deserialize(value));
    this._onValidatorChange();
  }

  /** The maximum valid date time. */
  @Input()
  get max(): Moment | null { return this._max; }
  set max(value: Moment | null) {
    this._max = this._getValidDateOrNull(this._timeAdapter.deserialize(value));
    this._onValidatorChange();
  }

  /** Whether the time select input is disabled. */
  @HostBinding()
  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    const disabled = coerceBooleanProperty(value);
    const element = this._elementRef.nativeElement;
    if (this.disabled !== disabled) {
      this._disabled = disabled;
      this._disabledChange.next(disabled);
    }
    if (disabled && element.blur) {
      element.blur();
    }
  }

  /** @docs-private */
  @HostBinding('attr.aria-haspopup')
  get _ariaHasPopup(): boolean { return true; }

  /** @docs-private */
  @HostBinding('attr.aria-owns')
  get _ariaOwns(): boolean { return (this._timeSelect && this._timeSelect.opened && !!this._timeSelect.id) || null; }

  /** @docs-private */
  @HostBinding('attr.min')
  get _minTime(): string | null { return this.min ? this._timeAdapter.toIso8601(this.min) : null; }

  /** @docs-private */
  @HostBinding('attr.max')
  get _maxTime(): string | null { return this.max ? this._timeAdapter.toIso8601(this.max) : null; }

  constructor(private _elementRef: ElementRef<HTMLInputElement>,
              @Optional() private _timeAdapter: TimeAdapter,
              @Optional() @Inject(MAT_TIME_FORMATS) private _timeFormats: MatTimeFormats,
              @Optional() private _formField: MatFormField) {
    this._parseValidator = (): ValidationErrors | null => {
      return this._lastValueValid ? null : {'matTimeSelectParse': {'text': this._elementRef.nativeElement.value}};
    };

    this._minValidator = (control: AbstractControl): ValidationErrors | null => {
      const value = this._getValidDateOrNull(this._timeAdapter.deserialize(control.value));
      return !this.min || !value || this._timeAdapter.compareTime(this.min, value) <= 0 ?
        null : {'matTimeSelectMin': {'min': this.min, 'actual': value}};
    };

    this._maxValidator = (control: AbstractControl): ValidationErrors | null => {
      const value = this._getValidDateOrNull(this._timeAdapter.deserialize(control.value));
      return !this.max || !value || this._timeAdapter.compareTime(this.max, value) >= 0 ?
        null : {'matTimeSelectMax': {'max': this.max, 'actual': value}};
    };

    this._validator = Validators.compose([
      this._parseValidator,
      this._minValidator,
      this._maxValidator
    ]);

    this._localeSubscription = this._timeAdapter.localeChanges.subscribe(
      () => this.value = this.value
    );
  }

  ngOnDestroy() {
    this._timeSelectSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** @docs-private */
  validate(control: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(control) : null;
  }

  /** @docs-private */
  registerOnValidatorChange(fn: () => void): void {
    this._onValidatorChange = fn;
  }

  /**
   * Handle keydown event.
   * @param event The event object.
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const isAltDownArrow = event.altKey && event.keyCode === DOWN_ARROW;

    if (this._timeSelect && isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
      this._timeSelect.open();
      event.preventDefault();
    }
  }

  /**
   * Handle input event.
   * @param value The current value of the input.
   */
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    let time = this._timeAdapter.parse(value, this._timeFormats.parse.timeInput);
    this._lastValueValid = !time || this._timeAdapter.isValid(time);
    time = this._getValidDateOrNull(time);

    if (!this._timeAdapter.sameTime(this._value, time)) {
      this._value = time;
      this._onChange(time);
      this._valueChange.next(time);
      this.timeInput.emit(new MatTimeSelectInputEvent(this, this._elementRef.nativeElement));
    }
  }

  /**
   * Handle change event.
   */
  @HostListener('change')
  onChange() {
    this.timeChange.emit(new MatTimeSelectInputEvent(this, this._elementRef.nativeElement));
  }

  /**
   * Handle blur event.
   */
  @HostListener('blur')
  onBlur() {
    if (this.value) {
      this._formatValue(this.value);
    }
    this._onTouched();
  }

  /** Returns the palette used by the input's form field, if any. */
  getThemePalette(): ThemePalette {
    return this._formField ? this._formField.color : undefined;
  }

  /**
   * Gets the element that the time select popup should be connected to.
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
  }

  /** Formats a value and sets it on the input element. */
  private _formatValue(value: Moment | null) {
    this._elementRef.nativeElement.value = value ? this._timeAdapter.format(value, this._timeFormats.display.timeInput) : '';
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): Moment | null {
    return this._timeAdapter.isDateInstance(obj) && this._timeAdapter.isValid(obj) ? obj : null;
  }

}
