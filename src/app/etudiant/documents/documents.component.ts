import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';
import { Document, DocumentType } from 'src/app/models/document.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  currentUser: any;
  documents: Document[] = [];
  loading: boolean = false;
  uploadProgress: number = 0;
  uploading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
 
  documentTitle: string = '';
  documentType: string = DocumentType.NORMAL; // Default value
  selectedFile: File | null = null;

  constructor(
    private documentService: DocumentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser =  this.authService.currentUserValue;
    if (this.currentUser && this.currentUser.id) {
      this.loadDocuments();
    }
  }

  loadDocuments(): void {
    this.loading = true;
    this.documentService.getDocumentsByEtudiantId(this.currentUser.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (data) => {
          this.documents = data;
        },
        (error) => {
          console.error('Error loading documents', error);
          this.errorMessage = 'Erreur lors du chargement des documents';
        }
      );
  }

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadDocument(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier';
      return;
    }
    
    if (!this.documentTitle) {
      this.errorMessage = 'Veuillez entrer un titre pour le document';
      return;
      
    }
    
   
    this.errorMessage = '';
    this.successMessage = '';
    this.uploading = true;
    this.uploadProgress = 0;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('titre', this.documentTitle);
    formData.append('type', this.documentType);
    formData.append('etudiantId', this.currentUser.id);
    formData.append("projetId", "2");
    

    this.documentService.uploadDocument(formData).pipe(
      finalize(() => {
        this.uploading = false;
        this.resetForm();
      })
    ).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.successMessage = 'Document téléchargé avec succès';
          this.documents.unshift(event.body); 
        }
      },
      (error) => {
        console.error('Error uploading document', error);
        this.errorMessage = error.error || 'Erreur lors du téléchargement du document';
      }
    );
  }

  downloadDocument(document: Document): void {
    window.open(this.documentService.getDownloadUrl(document.id, this.currentUser.id), '_blank');
  }


  resetForm(): void {
    this.documentTitle = '';
    this.documentType = DocumentType.NORMAL;
    this.selectedFile = null;
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getDocumentTypeLabel(type: string): string {
    return type === 'rapport_final' ? 'Rapport Final' : 'Document Normal';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

 
}