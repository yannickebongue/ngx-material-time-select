import { TestBed } from '@angular/core/testing';

import { MatTimeSelectIntl } from './time-select-intl.service';

describe('MatTimeSelectIntl', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatTimeSelectIntl = TestBed.get(MatTimeSelectIntl);
    expect(service).toBeTruthy();
  });
});
