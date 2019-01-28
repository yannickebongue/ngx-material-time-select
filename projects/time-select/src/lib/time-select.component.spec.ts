import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTimeSelectComponent } from './time-select.component';

describe('MatTimeSelectComponent', () => {
  let component: MatTimeSelectComponent;
  let fixture: ComponentFixture<MatTimeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatTimeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTimeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
