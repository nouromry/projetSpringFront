import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAssociesComponent } from './documents-associes.component';

describe('DocumentsAssociesComponent', () => {
  let component: DocumentsAssociesComponent;
  let fixture: ComponentFixture<DocumentsAssociesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsAssociesComponent]
    });
    fixture = TestBed.createComponent(DocumentsAssociesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
