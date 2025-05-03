import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesChoixComponent } from './liste-des-choix.component';

describe('ListeDesChoixComponent', () => {
  let component: ListeDesChoixComponent;
  let fixture: ComponentFixture<ListeDesChoixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeDesChoixComponent]
    });
    fixture = TestBed.createComponent(ListeDesChoixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
