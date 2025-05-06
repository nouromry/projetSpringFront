import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Document } from 'src/app/models/document.model';
import { DocumentDetailsDTO } from 'src/app/models/document-details.dto';
import { HttpClient, HttpEvent, HttpRequest ,HttpResponse} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8081/api/documents'; 

  constructor(private http: HttpClient) { }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  getDocumentDetails(id: number): Observable<DocumentDetailsDTO> {
    return this.http.get<DocumentDetailsDTO>(`${this.apiUrl}/${id}/details`);
  }

  createDocument(document: Document): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, document);
  }

  updateDocument(id: number, document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, document);
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  downloadDocument(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob',
      observe: 'response'
    });
  }
 
  getDocumentsByEtudiantId(etudiantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/etudiant/${etudiantId}`);
  }

  
  uploadDocument(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

 
  getDownloadUrl(documentId: number, etudiantId: number): string {
    return `${this.apiUrl}/download/${documentId}/${etudiantId}`;
  }


  deleteDocumentEtud(documentId: number, etudiantId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documents/${documentId}/${etudiantId}`);
}
}