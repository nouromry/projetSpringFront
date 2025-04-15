import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportsPfaComponent } from './rapports-pfa.component';

describe('RapportsPfaComponent', () => {
  let component: RapportsPfaComponent;
  let fixture: ComponentFixture<RapportsPfaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RapportsPfaComponent]
    });
    fixture = TestBed.createComponent(RapportsPfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
