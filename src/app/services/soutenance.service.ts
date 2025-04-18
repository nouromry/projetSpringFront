// src/app/services/soutenance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Soutenance } from '../models/soutenance.model';

import { SoutenanceView } from '../models/soutenance-view.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoutenanceService {
  private apiUrl = 'http://localhost:8081/api/soutenances';

  constructor(private http: HttpClient) { }
  
  getAllSoutenances(): Observable<SoutenanceView[]> {
    return this.http.get<SoutenanceView[]>(this.apiUrl);
  }

  getSoutenanceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getSoutenancesByDate(date: Date): Observable<SoutenanceView[]> {
    // Format the date as required by your backend
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<SoutenanceView[]>(`${this.apiUrl}/date/${formattedDate}`);
  }
  createSoutenance(soutenance: Soutenance): Observable<Soutenance> {
    return this.http.post<Soutenance>(this.apiUrl, soutenance);
  }
  updateSoutenance(soutenance: Soutenance): Observable<Soutenance> {
    return this.http.put<Soutenance>(`${this.apiUrl}/${soutenance.id}`, soutenance);
  }

  deleteSoutenance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}