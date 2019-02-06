import { TestBed } from '@angular/core/testing';

import { MomentTimeAdapter } from './moment-time-adapter.service';

describe('MomentTimeAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MomentTimeAdapter = TestBed.get(MomentTimeAdapter);
    expect(service).toBeTruthy();
  });
});
