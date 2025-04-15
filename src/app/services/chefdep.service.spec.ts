import { TestBed } from '@angular/core/testing';

import { ChefdepService } from './chefdep.service';

describe('ChefdepService', () => {
  let service: ChefdepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChefdepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
