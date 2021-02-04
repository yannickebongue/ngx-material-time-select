import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTimeSelectToggleComponent } from './time-select-toggle.component';

describe('MatTimeSelectToggleComponent', () => {
  let component: MatTimeSelectToggleComponent<any>;
  let fixture: ComponentFixture<MatTimeSelectToggleComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatTimeSelectToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTimeSelectToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
