import { TestBed } from '@angular/core/testing';

import { TimeAdapter } from './time-adapter.service';

describe('TimeAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeAdapter = TestBed.get(TimeAdapter);
    expect(service).toBeTruthy();
  });
});
