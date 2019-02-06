import {Component} from '@angular/core';
import {ThemePalette} from '@angular/material';
import {FormControl} from '@angular/forms';
import {MatTimeSelectInputEvent} from '../../../projects/time-select/src/lib/time-select-input.directive';

@Component({
  selector: 'app-time-select-demo',
  templateUrl: './time-select-demo.component.html',
  styleUrls: ['./time-select-demo.component.scss']
})
export class TimeSelectDemoComponent {

  inputDisabled: boolean;
  timeSelectDisabled: boolean;
  minTime: Date;
  maxTime: Date;
  startAt: Date;
  time: Date;
  lastTimeInput: Date | null;
  lastTimeChange: Date | null;
  color: ThemePalette;

  timeCtrl = new FormControl();

  onTimeInput = (e: MatTimeSelectInputEvent<Date>) => this.lastTimeInput = e.value;
  onTimeChange = (e: MatTimeSelectInputEvent<Date>) => this.lastTimeChange = e.value;

}
