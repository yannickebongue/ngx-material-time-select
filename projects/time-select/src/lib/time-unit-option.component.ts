import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {CanDisableRippleCtor, mixinDisableRipple} from '@angular/material';
import {MatTimeUnitSelectComponent} from './time-unit-select.component';

export class MatTimeUnitOptionBase { }
export const _MatTimeUnitOptionMixinBase: CanDisableRippleCtor & typeof MatTimeUnitOptionBase =
  mixinDisableRipple(MatTimeUnitOptionBase);

/** Single time option inside a `<mat-time-unit-select>` element */
@Component({
  selector: 'mat-time-unit-option',
  templateUrl: './time-unit-option.component.html',
  styleUrls: ['./time-unit-option.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatTimeUnitOptionComponent extends _MatTimeUnitOptionMixinBase implements OnInit {

  private _disabled = false;
  private _selected = false;

  /** The value of the option. */
  @Input() value: number;
  /** Whether ripples for the option are disabled. */
  @Input() disableRipple: boolean;

  /** The element containing the display text of the option. */
  @ViewChild('text') _text: ElementRef<HTMLElement>;

  /** @docs-private */
  @HostBinding('class') readonly class = 'mat-time-unit-option';
  /** @docs-private */
  @HostBinding('attr.role') readonly role = 'option';
  /** @docs-private */
  @HostBinding('attr.tabindex') readonly tabindex = -1;

  /** Whether or not the option is currently selected. */
  @Input()
  @HostBinding('class.mat-time-unit-option-selected')
  get selected(): boolean { return this._selected; }
  set selected(value: boolean) {
    const selected = coerceBooleanProperty(value);
    if (this._selected !== selected) {
      this._selected = selected;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Whether the option is disabled. */
  @Input()
  @HostBinding('class.mat-time-unit-option-disabled')
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    const disabled = coerceBooleanProperty(value);
    if (this._disabled !== disabled) {
      this._disabled = disabled;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** @docs-private */
  @HostBinding('attr.aria-disabled')
  get ariaDisabled(): string { return this.disabled.toString(); }

  constructor(private _elementRef: ElementRef<HTMLElement>,
              private _changeDetectorRef: ChangeDetectorRef,
              @Inject(forwardRef(() => MatTimeUnitSelectComponent)) public timeUnitSelect: MatTimeUnitSelectComponent) {
    super();
  }

  ngOnInit() {
    this.timeUnitSelect.valueChange.subscribe(value => this.selected = this.value === value);
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    return this._text ? (this._text.nativeElement.textContent || '').trim() : '';
  }

  /** Gets the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** Whether ripples for the option are disabled. */
  _isRippleDisabled(): boolean {
    return this.disabled || this.disableRipple;
  }

  /** @docs-private */
  _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }

  /** Handle click on the option. */
  @HostListener('click')
  _onClick() {
    if (!this.selected) {
      this.timeUnitSelect.move(this.value - this.timeUnitSelect.value);
    }
  }

}
