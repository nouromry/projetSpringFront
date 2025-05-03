import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { DocumentDetailsDTO } from '../../models/document-details.dto';

@Component({
  selector: 'app-documents-associes',
  templateUrl: './documents-associes.component.html',
  styleUrls: ['./documents-associes.component.css']
})
export class DocumentsAssociesComponent implements OnInit {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  selectedFilter = 'tous';
  sharedDocument: Document | null = null;
  // Add these missing properties
  documentDetails: DocumentDetailsDTO | null = null;
  loading = false;
  error: string | null = null;

  filterOptions = [
    { value: 'semaine dernière', label: 'semaine dernière' },
    { value: 'aujourd\'hui', label: 'aujourd\'hui' },
    { value: 'mois dernier', label: 'mois dernier' },
    { value: 'tous', label: 'tous' }
  ];

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getAllDocuments().subscribe(
      (data) => {
        this.documents = data.filter(doc => doc.type === 'rapport_final'|| 'normal');
        this.applyFilter();
      },
      (error) => {
        console.error('Erreur lors du chargement des documents:', error);
      }
    );
  }

  applyFilter(): void {
    const today = new Date();
    switch (this.selectedFilter) {
      case 'aujourd\'hui':
        this.filteredDocuments = this.documents.filter(doc => {
          const docDate = new Date(doc.dateDepot);
          return docDate.toDateString() === today.toDateString();
        });
        break;
      case 'semaine dernière':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        this.filteredDocuments = this.documents.filter(doc => {
          const docDate = new Date(doc.dateDepot);
          return docDate >= lastWeek && docDate <= today;
        });
        break;
      case 'mois dernier':
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        this.filteredDocuments = this.documents.filter(doc => {
          const docDate = new Date(doc.dateDepot);
          return docDate >= lastMonth && docDate <= today;
        });
        break;
      case 'tous':
      default:
        this.filteredDocuments = [...this.documents];
        break;
    }
  }

  onFilterChange(event: any): void {
    this.selectedFilter = event.target.value;
    this.applyFilter();
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}\\${month}\\${year}`;
  }

  deleteDocument(id: number): void {
    this.documentService.deleteDocument(id).subscribe(
      () => {
        this.documents = this.documents.filter(doc => doc.id !== id);
        this.applyFilter();
      },
      (error) => {
        console.error('Erreur lors de la suppression du document:', error);
      }
    );
  }

  shareDocument(document: Document): void {
    this.sharedDocument = document;
    this.loading = true;
    this.error = null;
    this.documentDetails = null;
    
    // Get detailed information about the document
    this.documentService.getDocumentDetails(document.id).subscribe({
      next: (details) => {
        this.documentDetails = details;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails du document';
        this.loading = false;
        console.error('Erreur lors du chargement des détails du document:', err);
      }
    });
  }

  closeShareForm(): void {
    this.sharedDocument = null;
    this.documentDetails = null;
  }

  telechargerDocument(): void {
    if (this.sharedDocument) {
      this.loading = true;
      this.documentService.downloadDocument(this.sharedDocument.id).subscribe({
        next: (response) => {
          this.loading = false;
  
          // Get filename from the Content-Disposition header or use a default
          let filename = 'document.pdf';
          const contentDisposition = response.headers.get('Content-Disposition');
          if (contentDisposition) {
            const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, '');
            }
          }
  
          const blob = response.body;
          if (blob) {
            const url = window.URL.createObjectURL(blob);
  
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
  
            window.URL.revokeObjectURL(url);
          } else {
            this.error = 'Document vide ou introuvable.';
            console.error('Le corps de la réponse (blob) est null.');
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Erreur lors du téléchargement du document';
          console.error('Erreur lors du téléchargement du document:', err);
        }
      });
    }
  }
  
}