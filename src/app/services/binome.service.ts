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
  id: number;
  prenomEtud1: string;
  nomEtud1: string;
  prenomEtud2: string;
  nomEtud2: string;
  filiere: string;
  groupe: string;
  moyenneEtud1: number;
  moyenneEtud2: number;
  moyenneBinome: number;
  projetsChoisis: string[];
  projetAffecte?: Projet;
}

export interface BinomeDTO1 {
  id: number;
  prenomEtud1: string;
  nomEtud1: string;
  prenomEtud2: string;
  nomEtud2: string;
  filiere: string;
  groupe: string;
  moyenneEtud1: number;
  moyenneEtud2: number;
  moyenneBinome: number;
  projetsChoisis: string[];
  projetAffecte?: Projet; 
}

  // Import the service

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
      withCredentials: true 
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

  
  getBinomeById(id: number): Observable<Binome> {
    return this.http.get<Binome>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      tap(binome => console.log('Binome fetched:', binome)),
      catchError(this.handleError)
    );
  }

  creerBinome(matriculeEtud1: string, matriculeEtud2: string): Observable<Binome> {
    return this.http.post<Binome>(`${this.apiUrl}/creer-binome`, {
      matriculeEtud1,
      matriculeEtud2
    }, this.getHttpOptions()).pipe(
      tap(binome => console.log('Binome created:', binome)),
      catchError(this.handleError)
    );
  }

  updateBinome(binome: Binome): Observable<Binome> {
    return this.http.put<Binome>(`${this.apiUrl}/${binome.id}`, binome, this.getHttpOptions()).pipe(
      tap(updatedBinome => console.log('Binome updated:', updatedBinome)),
      catchError(this.handleError)
    );
  }

  deleteBinome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      tap(() => console.log('Binome deleted:', id)),
      catchError(this.handleError)
    );
  }

  getBinomesWithoutSoutenance(): Observable<Binome[]> {
    return this.http.get<Binome[]>(`${this.apiUrl}/without-soutenance`, this.getHttpOptions()).pipe(
      tap(binomes => console.log('Binomes without soutenance:', binomes.length)),
      catchError(this.handleError)
    );
  }

  getBinomeIdForCurrentUser(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/current-user-binome`, this.getHttpOptions()).pipe(
      tap(binomeId => console.log('Current user binome ID:', binomeId)),
      catchError(this.handleError)
    );
  }

  getProjetsDisponibles(): Observable<ProjetDTO[]> {
    return this.http.get<ProjetDTO[]>(`${this.apiUrl}/projets-disponibles`, this.getHttpOptions()).pipe(
      tap(projets => console.log('Available projects fetched:', projets.length)),
      catchError(this.handleError)
    );
  }

  getProjetsByFiliere(filiere: string): Observable<ProjetDTO[]> {
    return this.http.get<ProjetDTO[]>(
      `${this.apiUrl}/projets-disponibles?filiere=${filiere}`, 
      this.getHttpOptions()
    ).pipe(
      tap(projets => console.log(`Projects for filiere ${filiere} fetched:`, projets.length)),
      catchError(this.handleError)
    );
  }

  
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

 
  getChoixProjetsByBinome(binomeId: number): Observable<ProjetChoixDTO[]> {
    return this.http.get<ProjetChoixDTO[]>(
      `${this.apiUrl}/binome/${binomeId}/choix`, 
      this.getHttpOptions()
    ).pipe(
      tap(choices => console.log('Project choices fetched for binome:', binomeId)),
      catchError(this.handleError)
    );
  }

 
  getProjetByBinomeId(binomeId: number): Observable<Projet> {
    return this.http.get<Projet>(
      `${this.apiUrl}/${binomeId}/projet`, 
      this.getHttpOptions()
    ).pipe(
      tap(projet => console.log('Project fetched for binome ID:', binomeId)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
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