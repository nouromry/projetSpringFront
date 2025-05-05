import { TestBed } from '@angular/core/testing';

import { JurySoutenanceService } from './jury-soutenance.service';

describe('JurySoutenanceService', () => {
  let service: JurySoutenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JurySoutenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
