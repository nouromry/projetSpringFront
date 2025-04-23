import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningSoutenancesComponent } from './planning-soutenances.component';

describe('PlanningSoutenancesComponent', () => {
  let component: PlanningSoutenancesComponent;
  let fixture: ComponentFixture<PlanningSoutenancesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningSoutenancesComponent]
    });
    fixture = TestBed.createComponent(PlanningSoutenancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
