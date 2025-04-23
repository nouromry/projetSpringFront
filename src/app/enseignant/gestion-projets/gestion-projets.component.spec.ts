import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProjetsComponent } from './gestion-projets.component';

describe('GestionProjetsComponent', () => {
  let component: GestionProjetsComponent;
  let fixture: ComponentFixture<GestionProjetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionProjetsComponent]
    });
    fixture = TestBed.createComponent(GestionProjetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
