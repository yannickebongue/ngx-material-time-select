import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TimeSelectDemoComponent} from './time-select-demo/time-select-demo.component';

const routes: Routes = [
  {path: '', component: TimeSelectDemoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
