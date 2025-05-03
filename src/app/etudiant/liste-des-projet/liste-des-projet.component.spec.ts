import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesProjetComponent } from './liste-des-projet.component';

describe('ListeDesProjetComponent', () => {
  let component: ListeDesProjetComponent;
  let fixture: ComponentFixture<ListeDesProjetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeDesProjetComponent]
    });
    fixture = TestBed.createComponent(ListeDesProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
