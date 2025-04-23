import { TestBed } from '@angular/core/testing';

import { SoutenanceServiceService } from './soutenance-service.service';

describe('SoutenanceServiceService', () => {
  let service: SoutenanceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoutenanceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
