import { TestBed } from '@angular/core/testing';

import { NgtColoquentHttpValidationServiceService } from './ngt-coloquent-http-validation-service.service';

describe('NgtColoquentHttpValidationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgtColoquentHttpValidationServiceService = TestBed.get(NgtColoquentHttpValidationServiceService);
    expect(service).toBeTruthy();
  });
});
