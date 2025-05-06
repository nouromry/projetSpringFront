import { Injectable } from '@angular/core';
import { ChoixProjet } from '../models/choix-projet.model';
import { Observable } from 'rxjs';
import { Projet } from '../models/projet.model';
import { ProjetChoixDTO } from 'src/app/models/ProjetChoixDTO.model';
import { Binome } from '../models/binome.model';
import { HttpClient } from '@angular/common/http';



export interface BinomeCreationDTO {
  matriculeEtud1: string;
  matriculeEtud2: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChoixProjetService {
  private apiUrl = 'http://localhost:8081/api/choix-projets'; 

  constructor(private http: HttpClient) { }

 
  creerBinome(matricule1: string, matricule2: string): Observable<Binome> {
    const binomeDTO: BinomeCreationDTO = {
      matriculeEtud1: matricule1,
      matriculeEtud2: matricule2
    };
    return this.http.post<Binome>(`${this.apiUrl}/creer-binome`, binomeDTO);
  }

  enregistrerChoixProjets(idBinome: number, choix: ProjetChoixDTO[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/binome/${idBinome}/choix`, choix);
  }

  
  getProjetsDisponibles(): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiUrl}/projets-disponibles`);
  }

  
  getChoixProjetsByBinome(idBinome: number): Observable<ChoixProjet[]> {
    return this.http.get<ChoixProjet[]>(`${this.apiUrl}/binome/${idBinome}/choix`);
  }
}