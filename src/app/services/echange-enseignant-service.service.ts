import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Commentaire {
  id: number;
  contenu: string;
  dateCommentaire: Date;
  auteur: {
    id: number;
    nom: string;
    prenom: string;
    role: string;
  };
}

export interface Projet {
  id: number;
  titre: string;
  description: string;
  technologies: string;
  etat: string;
  dateDepot: Date;
  dateAffectation: Date | null;
  filiere: string;
  enseignant: {
    id: number;
    nom: string;
    prenom: string;
  };
  binomeAffecte?: {
    id: number;
    etud1: {
      id: number;
      nom: string;
      prenom: string;
    };
    etud2: {
      id: number;
      nom: string;
      prenom: string;
    };
    moyenneBinome?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EchangeEnseignantService {
  private apiUrl = 'http://localhost:8081/api/enseignant/echange';

  constructor(private http: HttpClient) { }

  getCommentsForEnseignant(enseignantId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/${enseignantId}/comments`);
  }

  getCommentsForProject(projetId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/projet/${projetId}/comments`);
  }

  addComment(enseignantId: number, projetId: number, contenu: string): Observable<Commentaire> {
    return this.http.post<Commentaire>(
      `${this.apiUrl}/${enseignantId}/projet/${projetId}/comment`,
      { contenu },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  getProjectsForEnseignant(enseignantId: number): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiUrl}/${enseignantId}/projets`);
  }
}