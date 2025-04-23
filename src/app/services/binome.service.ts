import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Binome } from '../models/binome.model';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
export interface BinomeDTO {
  prenomEtud1: string;
  nomEtud1: string;
  prenomEtud2: string;
  nomEtud2: string;
  filiere: string;
  groupe: string;
  moyenneEtud1: number;
  moyenneBinome: number;
  projetsChoisis: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BinomeService {

  private apiUrl = 'http://localhost:8081/api/binomes/details';

  constructor(private http: HttpClient) {}

  getBinomeDetails(): Observable<BinomeDTO[]> {
    return this.http.get<BinomeDTO[]>(this.apiUrl);
  }
    // Get all binomes
    getAllBinomes(): Observable<Binome[]> {
      return this.http.get<Binome[]>(this.apiUrl).pipe(
        tap(data => console.log('Binomes fetched:', data.length)),
        catchError(this.handleError)
      );
    }
  
    // Get a specific binome by ID
    getBinomeById(id: number): Observable<Binome> {
      return this.http.get<Binome>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  
    // Create a new binome
    createBinome(binome: Binome): Observable<Binome> {
      return this.http.post<Binome>(this.apiUrl, binome).pipe(
        catchError(this.handleError)
      );
    }
  
    // Update an existing binome
    updateBinome(binome: Binome): Observable<Binome> {
      return this.http.put<Binome>(`${this.apiUrl}/${binome.id}`, binome).pipe(
        catchError(this.handleError)
      );
    }
  
    // Delete a binome
    deleteBinome(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  
    // Get binomes without a soutenance
    getBinomesWithoutSoutenance(): Observable<Binome[]> {
      return this.http.get<Binome[]>(`${this.apiUrl}/without-soutenance`).pipe(
        catchError(this.handleError)
      );
    }
  
    // Error handling
    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'An unknown error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    }
 }
