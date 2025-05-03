import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceEchangeComponent } from './espace-echange.component';

describe('EspaceEchangeComponent', () => {
  let component: EspaceEchangeComponent;
  let fixture: ComponentFixture<EspaceEchangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspaceEchangeComponent]
    });
    fixture = TestBed.createComponent(EspaceEchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
