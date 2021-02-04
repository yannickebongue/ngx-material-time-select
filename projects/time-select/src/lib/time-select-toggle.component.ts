import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {MatButton} from '@angular/material';
import {merge, of, Subscription} from 'rxjs';
import {MatTimeSelectIntl} from './time-select-intl.service';
import {MatTimeSelectComponent} from './time-select.component';

/** Can be used to override the icon of a `matTimeSelectToggle`. */
@Directive({
  selector: '[matTimeSelectToggleIcon]'
})
export class MatTimeSelectToggleIconDirective {}

@Component({
  selector: 'mat-time-select-toggle',
  templateUrl: './time-select-toggle.component.html',
  styleUrls: ['./time-select-toggle.component.scss'],
  exportAs: 'matTimeSelectToggle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatTimeSelectToggleComponent<D> implements AfterContentInit, OnChanges, OnDestroy {

  private _stateChanges = Subscription.EMPTY;

  private _disabled: boolean;
  private _disableRipple: boolean;

  /** Time select instance that the button will toggle. */
  @Input('for') timeSelect: MatTimeSelectComponent<D>;
  /** Tabindex for the toggle. */
  @Input() tabIndex: number | null;

  /** Custom icon set by the consumer. */
  @ContentChild(MatTimeSelectToggleIconDirective, /* TODO: add static flag */ {}) customIcon: MatTimeSelectToggleIconDirective;
  /** Underlying button element. */
  @ViewChild('button', { static: true }) button: MatButton;

  /** Whether the toggle button is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined ? this.timeSelect.disabled : this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  /** Whether ripples on the toggle should be disabled. */
  @Input()
  get disableRipple(): boolean {
    return this._disableRipple;
  }
  set disableRipple(value: boolean) {
    this._disableRipple = coerceBooleanProperty(value);
  }

  /** @docs-private */
  @HostBinding('class')
  get class(): string { return 'mat-time-select-toggle'; }

  /** @docs-private */
  @HostBinding('attr.tabindex')
  get tabindex(): string { return '-1'; }

  /** @docs-private */
  @HostBinding('class.mat-time-select-toggle-active')
  get active(): boolean { return this.timeSelect && this.timeSelect.opened; }

  /** @docs-private */
  @HostBinding('class.mat-accent')
  get accent(): boolean { return this.timeSelect && this.timeSelect.color === 'accent'; }

  /** @docs-private */
  @HostBinding('class.mat-warn')
  get warn(): boolean { return this.timeSelect && this.timeSelect.color === 'warn'; }

  constructor(public _intl: MatTimeSelectIntl,
              private _changeDetectorRef: ChangeDetectorRef,
              @Attribute('tabindex') defaultTabIndex: string) {
    const parsedTabIndex = parseInt(defaultTabIndex, 10);
    this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
  }

  ngAfterContentInit() {
    this._watchStateChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.timeSelect) {
      this._watchStateChanges();
    }
  }

  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  /** Handle focus event. */
  @HostListener('focus')
  onFocus() {
    this.button.focus();
  }

  /**
   * Open the time select.
   * @param event The triggered event to open the time select.
   */
  open(event: Event): void {
    if (this.timeSelect && !this.disabled) {
      this.timeSelect.open();
      event.stopPropagation();
    }
  }

  private _watchStateChanges() {
    const timeSelectDisabled = this.timeSelect ? this.timeSelect.disabledChange : of();
    const inputDisabled = this.timeSelect && this.timeSelect._timeSelectInput ?
      this.timeSelect._timeSelectInput.disabledChange : of();
    const timeSelectToggled = this.timeSelect ?
      merge(this.timeSelect.openStream, this.timeSelect.closeStream) :
      of();

    this._stateChanges.unsubscribe();
    this._stateChanges = merge(
      this._intl.changes,
      timeSelectDisabled,
      inputDisabled,
      timeSelectToggled
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }

}
