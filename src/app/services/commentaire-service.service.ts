import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private apiUrl = 'http://localhost:8081/api//api/commentaires';

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les commentaires
   */
  getAllCommentaires(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Récupère un commentaire par son ID
   */
  getCommentaireById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère les commentaires pour un projet spécifique
   */
  getCommentairesByProjetId(projetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projet/${projetId}`);
  }

  /**
   * Récupère les commentaires des étudiants encadrés par l'enseignant connecté
   */
  getCommentairesForCurrentEnseignant(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enseignant/etudiants`);
  }

  /**
   * Récupère les commentaires des étudiants encadrés par un enseignant spécifique
   */
  getCommentairesForEnseignant(enseignantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enseignant/${enseignantId}/etudiants`);
  }

  /**
   * Ajoute un nouveau commentaire
   */
  createCommentaire(commentaire: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, commentaire);
  }

  /**
   * Met à jour un commentaire existant
   */
  updateCommentaire(id: number, commentaire: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, commentaire);
  }

  /**
   * Supprime un commentaire
   */
  deleteCommentaire(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}