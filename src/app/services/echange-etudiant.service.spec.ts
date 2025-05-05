import { TestBed } from '@angular/core/testing';

import { EchangeEtudiantService } from './echange-etudiant.service';

describe('EchangeEtudiantService', () => {
  let service: EchangeEtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EchangeEtudiantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
