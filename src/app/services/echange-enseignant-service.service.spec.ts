import { TestBed } from '@angular/core/testing';

import { EchangeEnseignantServiceService } from './echange-enseignant-service.service';

describe('EchangeEnseignantServiceService', () => {
  let service: EchangeEnseignantServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EchangeEnseignantServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
