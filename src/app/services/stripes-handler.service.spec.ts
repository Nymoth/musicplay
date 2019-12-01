import { TestBed } from '@angular/core/testing';

import { StripesHandlerService } from './stripes-handler.service';

describe('StripesHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StripesHandlerService = TestBed.get(StripesHandlerService);
    expect(service).toBeTruthy();
  });
});
