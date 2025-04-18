// src/app/services/enseignant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private apiUrl = `${environment.apiUrl}/enseignants`;

  constructor(private http: HttpClient) { }

  getAllEnseignants(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEnseignantById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getEnseignantsBySpecialite(specialite: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/specialite/${specialite}`);
  }

  createEnseignant(enseignant: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, enseignant);
  }

  updateEnseignant(id: number, enseignant: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, enseignant);
  }

  deleteEnseignant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}