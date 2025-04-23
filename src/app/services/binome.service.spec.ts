import { TestBed } from '@angular/core/testing';

import { BinomeService } from './binome.service';

describe('BinomeService', () => {
  let service: BinomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
