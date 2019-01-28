import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTimeUnitOptionComponent } from './time-unit-option.component';

describe('MatTimeUnitOptionComponent', () => {
  let component: MatTimeUnitOptionComponent;
  let fixture: ComponentFixture<MatTimeUnitOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatTimeUnitOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTimeUnitOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
