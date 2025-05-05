import { TestBed } from '@angular/core/testing';

import { ChoixProjetService } from './choix-projet.service';

describe('ChoixProjetService', () => {
  let service: ChoixProjetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoixProjetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
