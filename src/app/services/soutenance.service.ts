import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Soutenance } from '../models/soutenance.model';
import { SoutenanceView } from '../models/soutenance-view.model';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoutenanceService {
  private apiUrl = 'http://localhost:8081/api/soutenances';

  constructor(private http: HttpClient) {}

  getAllSoutenances(): Observable<SoutenanceView[]> {
    console.log('Fetching soutenances from:', this.apiUrl); // Add this line
    return this.http.get<SoutenanceView[]>(this.apiUrl).pipe(
      tap(data => console.log('Received data:', data)),
      catchError(error => {
        console.error('Error fetching soutenances:', error);
        return throwError(error);
      })
    );
  }

  getSoutenanceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  
  getSoutenancesByDate(date: string | Date): Observable<SoutenanceView[]> {
    // Format date if it's a Date object
    const formattedDate = date instanceof Date ? 
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : 
      date;
    
    let params = new HttpParams().set('date', formattedDate);
    return this.http.get<SoutenanceView[]>(`${this.apiUrl}/by-date`, { params });
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

  addJuryMember(juryMember: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/jurys`, juryMember);
  }
  createSoutenanceSimplified(soutenanceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/simplified`, soutenanceData);
  }

  addJuryMembers(juryPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/jury/batch`, juryPayload);
  }

  
}
