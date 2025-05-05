// src/app/services/enseignant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface SoutenanceWithRoleDTO {
  id: number;
  date: string;
  heureD: string;
  salle: string;
  binome: BinomeDTO;
  role: string;
}

export interface ProjetWithBinomeDTO {
  id: number;
  titre: string;
  description: string;
  technologies: string;
  etat: string;
  dateDepot: string;
  dateAffectation: string;
  filiere: string;
  binomeAffecte?: BinomeDTO;
  enseignant: EnseignantDTO;
}

export interface BinomeDTO {
  id: number;
  etud1: EtudiantDTO;
  etud2: EtudiantDTO;
  moyenneBinome?: number;
}

export interface EtudiantDTO {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  filiere: string;
  groupe: string;
  moyenneGeneral?: number;
}

export interface EnseignantDTO {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
}

// Keep your existing Projet and Enseignant interfaces
export interface Projet {
  id: number;
  titre: string;
  description: string;
  // ... other properties
}

export interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
  // ... other properties
}
@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private apiUrl = 'http://localhost:8081/api/enseignants';

  constructor(private http: HttpClient) { }

 
  getValidProjectsWithBinomeDetails(enseignantId: number): Observable<ProjetWithBinomeDTO[]> {
    return this.http.get<ProjetWithBinomeDTO[]>(
      `${this.apiUrl}/${enseignantId}/projets-valides`
    );
  }

  getSoutenancesByEnseignant(enseignantId: number): Observable<SoutenanceWithRoleDTO[]> {
    return this.http.get<SoutenanceWithRoleDTO[]>(
      `${this.apiUrl}/${enseignantId}/soutenances`
    );
  }
}