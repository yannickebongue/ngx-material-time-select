import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSelectDemoComponent } from './time-select-demo.component';

describe('TimeSelectDemoComponent', () => {
  let component: TimeSelectDemoComponent;
  let fixture: ComponentFixture<TimeSelectDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSelectDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSelectDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
