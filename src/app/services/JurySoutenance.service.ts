import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JurySoutenance } from '../models/jury-soutenance.model';

@Injectable({
  providedIn: 'root'
})
export class JurySoutenanceService {
  private apiUrl = 'http://localhost:8081/api/jury-soutenances';

  constructor(private http: HttpClient) { }

  getJuryForSoutenance(soutenanceId: number): Observable<JurySoutenance[]> {
    return this.http.get<JurySoutenance[]>(`${this.apiUrl}/soutenance/${soutenanceId}`);
  }

  assignJuryToSoutenance(jurySoutenance: JurySoutenance): Observable<JurySoutenance> {
    return this.http.post<JurySoutenance>(this.apiUrl, jurySoutenance);
  }

  updateJuryRole(jurySoutenance:JurySoutenance): Observable<JurySoutenance> {
    return this.http.put<JurySoutenance>(`${this.apiUrl}/${jurySoutenance.id.enseignantId}/${jurySoutenance.id.soutenanceId}`, jurySoutenance);
  }

  removeJuryFromSoutenance(enseignantId: number, soutenanceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${enseignantId}/${soutenanceId}`);
  }
  
}