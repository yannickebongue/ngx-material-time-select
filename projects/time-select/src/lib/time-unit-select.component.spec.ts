import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTimeUnitSelectComponent } from './time-unit-select.component';

describe('MatTimeUnitSelectComponent', () => {
  let component: MatTimeUnitSelectComponent;
  let fixture: ComponentFixture<MatTimeUnitSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatTimeUnitSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTimeUnitSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
