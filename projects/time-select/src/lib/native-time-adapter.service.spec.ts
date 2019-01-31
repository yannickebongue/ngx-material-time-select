import { TestBed } from '@angular/core/testing';

import { NativeTimeAdapter } from './native-time-adapter.service';

describe('NativeTimeAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NativeTimeAdapter = TestBed.get(NativeTimeAdapter);
    expect(service).toBeTruthy();
  });
});
