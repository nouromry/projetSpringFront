import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet } from '../models/projet.model';
import { Etudiant } from '../models/etudiant.model';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private baseUrl = 'http://localhost:8081/api/etudiants';
  private apiUrl = 'http://localhost:8081/api/etudiants'; 

  constructor(private http: HttpClient) { }

  creerProjet(etudiantId: number, projetData: any): Observable<Projet> {
  return this.http.post<Projet>(
    `${this.baseUrl}/${etudiantId}/projets`,
    projetData,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true
    }
  );}


  getEtudiantDetails(etudiantId: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(
      `${this.baseUrl}/${etudiantId}`, 
      { withCredentials: true }
    );
  }

  updateProjet(etudiantId: number, projetId: number, updates: Partial<Projet>): Observable<Projet> {
    return this.http.put<Projet>(
      `${this.baseUrl}/${etudiantId}/projets/${projetId}`, 
      updates,
      { withCredentials: true }
    );
  }
 
   getEtudiantByMatricule(matricule: string): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/matricule/${matricule}`);
  }
  
  getEtudiantById(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/${id}`);
  }

  saveEtudiant(etudiant: Etudiant): Observable<Etudiant> {
    if (etudiant.id) {
      return this.http.put<Etudiant>(`${this.apiUrl}/${etudiant.id}`, etudiant);
    } else {
      return this.http.post<Etudiant>(this.apiUrl, etudiant);
    }
  }
  
}