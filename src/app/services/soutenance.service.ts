
import { Soutenance } from '../models/soutenance.model';
import { SoutenanceView } from '../models/soutenance-view.model';
import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Binome } from '../models/binome.model';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SoutenanceService {
  private apiUrl = 'http://localhost:8081/api/soutenances';

  constructor(private http: HttpClient) {}

  getAllSoutenances(): Observable<SoutenanceView[]> {
    return this.http.get<SoutenanceView[]>(this.apiUrl);
  }

  getSoutenanceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap(data => {
        console.log('Soutenance details fetched:', data);
        console.log('Binome:', data.binome); // Ensure the binome data is correct here
      }),
      catchError((error) => {
        console.error('Error fetching soutenance by id:', error);
        return throwError(() => error);
      })
    );
  }
  
  getSoutenancesByDate(date: Date): Observable<SoutenanceView[]> {
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
