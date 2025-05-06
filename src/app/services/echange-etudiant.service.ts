import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CommentaireDTO {
  id: number;
  contenu: string;
  dateCreation: Date;
  etudiantId: number;
  etudiantNom: string;
  etudiantPrenom: string;
  projetId: number;
  projetTitre: string;
  lu: boolean;
}

export interface Binome {
  id: number;
  etudiant1Id: number;
  etudiant1Nom: string;
  etudiant1Prenom: string;
  etudiant2Id: number;
  etudiant2Nom: string;
  etudiant2Prenom: string;
  active: boolean;
}


export interface ProjetWithBinomeDTO {
  id: number;
  titre: string;
  description: string;
  encadrantId: number;
  encadrantNom: string;
  encadrantPrenom: string;
  etat: string;
  dateDepot?: Date;
  dateSoutenance?: Date;
  binome: Binome;
}

export interface Commentaire {
  id: number;
  contenu: string;
  dateCreation: Date;
  etudiantId: number;
  projetId: number;
  lu: boolean;
}
  
@Injectable({
  providedIn: 'root'
})
export class EchangeEtudiantService {
  private apiUrl = environment.apiUrl ? `${environment.apiUrl}/etudiant/echange` : 'http://localhost:8081/api/etudiant/echange';
  
  constructor(private http: HttpClient) { }


  getProjetForEtudiant(etudiantId: number): Observable<ProjetWithBinomeDTO> {
    return this.http.get<ProjetWithBinomeDTO>(`${this.apiUrl}/${etudiantId}/projet`)
      .pipe(
        catchError(this.handleError)
      );
  }


  getCommentsForEtudiantProjet(etudiantId: number): Observable<CommentaireDTO[]> {
    return this.http.get<CommentaireDTO[]>(`${this.apiUrl}/${etudiantId}/comments`)
      .pipe(
        catchError(this.handleError)
      );
  }


  addComment(etudiantId: number, contenu: string): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/${etudiantId}/comment`, { contenu })
      .pipe(
        catchError(this.handleError)
      );
  }


  hasActiveBinome(etudiantId: number): Observable<{ hasBinome: boolean }> {
    return this.http.get<{ hasBinome: boolean }>(`${this.apiUrl}/${etudiantId}/has-binome`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
  hasAssignedProject(etudiantId: number): Observable<{ hasProject: boolean }> {
    return this.http.get<{ hasProject: boolean }>(`${this.apiUrl}/${etudiantId}/has-project`)
      .pipe(
        catchError(this.handleError)
      );
  }


  getCommentsByEtudiant(etudiantId: number): Observable<CommentaireDTO[]> {
    return this.http.get<CommentaireDTO[]>(`${this.apiUrl}/${etudiantId}/my-comments`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
  getLatestCommentsForEtudiantProjects(etudiantId: number): Observable<CommentaireDTO[]> {
    return this.http.get<CommentaireDTO[]>(`${this.apiUrl}/${etudiantId}/latest-comments`)
      .pipe(
        catchError(this.handleError)
      );
  }


  getUnreadCommentsForEtudiant(etudiantId: number): Observable<CommentaireDTO[]> {
    return this.http.get<CommentaireDTO[]>(`${this.apiUrl}/${etudiantId}/unread-comments`)
      .pipe(
        catchError(this.handleError)
      );
  }


  getAllCommentsForEtudiantProjects(etudiantId: number): Observable<CommentaireDTO[]> {
    return this.http.get<CommentaireDTO[]>(`${this.apiUrl}/${etudiantId}/all-comments`)
      .pipe(
        catchError(this.handleError)
      );
  }


  markCommentAsRead(commentId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/comments/${commentId}/mark-read`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

 
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}