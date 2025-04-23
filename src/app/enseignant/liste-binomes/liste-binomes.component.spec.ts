import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeBinomesComponent } from './liste-binomes.component';

describe('ListeBinomesComponent', () => {
  let component: ListeBinomesComponent;
  let fixture: ComponentFixture<ListeBinomesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeBinomesComponent]
    });
    fixture = TestBed.createComponent(ListeBinomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
