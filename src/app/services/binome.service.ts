import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Binome } from '../models/binome.model';
import { environment } from '../../environments/environment';
import { ProjetDTO } from 'src/app/models/ProjetDTO.model';
import { ProjetChoixDTO } from 'src/app/models/ProjetChoixDTO.model';
import { Projet } from '../models/projet.model';
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
  private apiUrl = environment.apiUrl ? `${environment.apiUrl}/binomes` : 'http://localhost:8081/api/binomes';
  private baseUrl = 'http://localhost:8081/api/binomes/details';

  constructor(private http: HttpClient) { }
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true // For CORS with credentials
    };
  }
  getBinomeDetails(): Observable<BinomeDTO[]> {
    return this.http.get<BinomeDTO[]>(this.baseUrl);
  }
  // Get all binomes
  getAllBinomes(): Observable<Binome[]> {
    return this.http.get<Binome[]>(this.apiUrl, this.getHttpOptions()).pipe(
      tap(data => console.log('Binomes fetched:', data.length)),
      catchError(this.handleError)
    );
  }

  // Get a specific binome by ID
  getBinomeById(id: number): Observable<Binome> {
    return this.http.get<Binome>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      tap(binome => console.log('Binome fetched:', binome)),
      catchError(this.handleError)
    );
  }

  // Create a new binome
  creerBinome(matriculeEtud1: string, matriculeEtud2: string): Observable<Binome> {
    return this.http.post<Binome>(`${this.apiUrl}/creer-binome`, {
      matriculeEtud1,
      matriculeEtud2
    }, this.getHttpOptions()).pipe(
      tap(binome => console.log('Binome created:', binome)),
      catchError(this.handleError)
    );
  }

  // Update an existing binome
  updateBinome(binome: Binome): Observable<Binome> {
    return this.http.put<Binome>(`${this.apiUrl}/${binome.id}`, binome, this.getHttpOptions()).pipe(
      tap(updatedBinome => console.log('Binome updated:', updatedBinome)),
      catchError(this.handleError)
    );
  }

  // Delete a binome
  deleteBinome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      tap(() => console.log('Binome deleted:', id)),
      catchError(this.handleError)
    );
  }

  // Get binomes without a soutenance
  getBinomesWithoutSoutenance(): Observable<Binome[]> {
    return this.http.get<Binome[]>(`${this.apiUrl}/without-soutenance`, this.getHttpOptions()).pipe(
      tap(binomes => console.log('Binomes without soutenance:', binomes.length)),
      catchError(this.handleError)
    );
  }

  // Get binome ID for current user
  getBinomeIdForCurrentUser(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/current-user-binome`, this.getHttpOptions()).pipe(
      tap(binomeId => console.log('Current user binome ID:', binomeId)),
      catchError(this.handleError)
    );
  }

  // Get available projects
  getProjetsDisponibles(): Observable<ProjetDTO[]> {
    return this.http.get<ProjetDTO[]>(`${this.apiUrl}/projets-disponibles`, this.getHttpOptions()).pipe(
      tap(projets => console.log('Available projects fetched:', projets.length)),
      catchError(this.handleError)
    );
  }

  /**
   * Get available projects filtered by filiere
   */
  getProjetsByFiliere(filiere: string): Observable<ProjetDTO[]> {
    return this.http.get<ProjetDTO[]>(
      `${this.apiUrl}/projets-disponibles?filiere=${filiere}`, 
      this.getHttpOptions()
    ).pipe(
      tap(projets => console.log(`Projects for filiere ${filiere} fetched:`, projets.length)),
      catchError(this.handleError)
    );
  }

  /**
   * Register project choices for a binome
   */
  enregistrerChoixProjets(binomeId: number, choix: ProjetChoixDTO[]): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/binome/${binomeId}/choix`, 
      choix, 
      this.getHttpOptions()
    ).pipe(
      tap(response => console.log('Project choices registered for binome:', binomeId)),
      catchError(this.handleError)
    );
  }

  /**
   * Get project choices for a binome
   */
  getChoixProjetsByBinome(binomeId: number): Observable<ProjetChoixDTO[]> {
    return this.http.get<ProjetChoixDTO[]>(
      `${this.apiUrl}/binome/${binomeId}/choix`, 
      this.getHttpOptions()
    ).pipe(
      tap(choices => console.log('Project choices fetched for binome:', binomeId)),
      catchError(this.handleError)
    );
  }

  /**
   * Get assigned project by binome ID
   * This function only loads the project, not the soutenance
   */
  getProjetByBinomeId(binomeId: number): Observable<Projet> {
    return this.http.get<Projet>(
      `${this.apiUrl}/${binomeId}/projet`, 
      this.getHttpOptions()
    ).pipe(
      tap(projet => console.log('Project fetched for binome ID:', binomeId)),
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion réseau.';
      } else if (error.status === 400) {
        errorMessage = 'Requête incorrecte. Veuillez vérifier vos données.';
        if (error.error?.message) {
          errorMessage += ` Détails: ${error.error.message}`;
        }
      } else if (error.status === 404) {
        errorMessage = 'La ressource demandée n\'a pas été trouvée.';
      } else if (error.status === 500) {
        errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
      } else {
        errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}