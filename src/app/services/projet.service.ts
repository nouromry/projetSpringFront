import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet } from 'src/app/models/projet.model';
import { ProjetDTO } from '../models/ProjetDTO.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private baseUrl = 'http://localhost:8081/api/projets'; 
  private apiUrl = environment.apiUrl + '/projets';// Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) { }

  
  getAllProjets(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.baseUrl);
  }

updateProjetStatus(id: number, status: string): Observable<Projet> {
  return this.http.put<Projet>(`${this.baseUrl}/${id}/status`, { status });
}

createProjet(projet: Projet): Observable<Projet> {
  return this.http.post<Projet>(this.baseUrl, projet);
}

/**
   * Get projects by status
   */
getProjetsByEtat(etat: string): Observable<ProjetDTO[]> {
  return this.http.get<ProjetDTO[]>(`${this.apiUrl}/etat/${etat}`);
}

/**
 * Get projects by filiere
 */
getProjetsByFiliere(filiere: string): Observable<ProjetDTO[]> {
  return this.http.get<ProjetDTO[]>(`${this.apiUrl}/filiere/${filiere}`);
}

/**
 * Search projects
 */
searchProjets(term: string): Observable<ProjetDTO[]> {
  return this.http.get<ProjetDTO[]>(`${this.apiUrl}/search?term=${term}`);
}

}