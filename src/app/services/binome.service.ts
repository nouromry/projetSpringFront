// src/app/services/binome.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BinomeService {
  private apiUrl = `${environment.apiUrl}/binomes`;

  constructor(private http: HttpClient) { }

  getAllBinomes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getBinomeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getBinomesByProject(projetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projet/${projetId}`);
  }

  createBinome(binome: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, binome);
  }

  updateBinome(id: number, binome: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, binome);
  }

  deleteBinome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}