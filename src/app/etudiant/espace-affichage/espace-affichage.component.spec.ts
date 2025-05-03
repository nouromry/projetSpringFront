import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceAffichageComponent } from './espace-affichage.component';

describe('EspaceAffichageComponent', () => {
  let component: EspaceAffichageComponent;
  let fixture: ComponentFixture<EspaceAffichageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspaceAffichageComponent]
    });
    fixture = TestBed.createComponent(EspaceAffichageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
