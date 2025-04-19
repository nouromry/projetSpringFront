import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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
}
