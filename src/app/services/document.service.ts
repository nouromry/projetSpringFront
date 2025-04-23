import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from 'src/app/models/document.model';
import { DocumentDetailsDTO } from 'src/app/models/document-details.dto';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8081/api/documents'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  // New method to get document details using the new endpoint
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

}