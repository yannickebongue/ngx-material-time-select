import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {A11yModule} from '@angular/cdk/a11y';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {MatButtonModule, MatButtonToggleModule, MatIconModule, MatRippleModule} from '@angular/material';

import {MAT_TIME_LOCALE_PROVIDER, TimeAdapter} from './time-adapter.service';
import {MatTimeSelectIntl} from './time-select-intl.service';

import {
  MAT_TIME_SELECT_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatTimeSelectComponent,
  MatTimeSelectContentComponent
} from './time-select.component';
import {MatTimeSelectInputDirective} from './time-select-input.directive';
import {MatTimeSelectToggleComponent, MatTimeSelectToggleIconDirective} from './time-select-toggle.component';
import {MatTimeUnitOptionComponent} from './time-unit-option.component';
import {MatTimeUnitSelectComponent} from './time-unit-select.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatRippleModule
  ],
  declarations: [
    MatTimeSelectComponent,
    MatTimeSelectContentComponent,
    MatTimeSelectInputDirective,
    MatTimeSelectToggleComponent,
    MatTimeSelectToggleIconDirective,
    MatTimeUnitOptionComponent,
    MatTimeUnitSelectComponent
  ],
  exports: [
    MatTimeSelectComponent,
    MatTimeSelectContentComponent,
    MatTimeSelectInputDirective,
    MatTimeSelectToggleComponent,
    MatTimeSelectToggleIconDirective,
    MatTimeUnitOptionComponent,
    MatTimeUnitSelectComponent
  ],
  entryComponents: [
    MatTimeSelectContentComponent
  ],
  providers: [
    TimeAdapter,
    MatTimeSelectIntl,
    MAT_TIME_LOCALE_PROVIDER,
    MAT_TIME_SELECT_SCROLL_STRATEGY_FACTORY_PROVIDER
  ]
})
export class MatTimeSelectModule { }
