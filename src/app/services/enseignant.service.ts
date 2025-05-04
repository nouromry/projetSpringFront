import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { Enseignant } from '../models/enseignant.model';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private apiUrl = 'http://localhost:8081/api/enseignants';
  constructor(private http: HttpClient) { }

  getAllEnseignants(): Observable<Enseignant[]> {
    console.log('Fetching enseignants from:', this.apiUrl);
  
    return this.http.get<Enseignant[]>(this.apiUrl).pipe(
      tap(data => console.log('Received enseignants:', data)),
      catchError(error => {
        console.error('Error fetching enseignants:', error);
        return throwError(() => error);
      })
    );
  }
  
  getEnseignantById(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/${id}`);
  }

  getEnseignantByEmail(email: string): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/email/${email}`);
  }

  getEnseignantsBySpecialite(specialite: string): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(`${this.apiUrl}/specialite/${specialite}`);
  }

  createEnseignant(enseignant: Enseignant): Observable<Enseignant> {
    return this.http.post<Enseignant>(this.apiUrl, enseignant);
  }

  updateEnseignant(id: number, enseignant: Enseignant): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.apiUrl}/${id}`, enseignant);
  }

  deleteEnseignant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchEnseignantsByName(nom: string): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(`${this.apiUrl}/search?nom=${nom}`);
  }

  getEnseignantsWithProjects(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(`${this.apiUrl}?withProjects=true`);
  }

  getEnseignantsAvailableForJury(date: string, timeSlot: string): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(`${this.apiUrl}/available?date=${date}&timeSlot=${timeSlot}`);
  }
  

}
