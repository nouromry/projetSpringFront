import { Component, OnInit } from '@angular/core';
import { EnseignantService } from '../../services/enseignant-service.service';

import { AuthService } from '../../services/auth.service';

export interface SoutenanceWithRoleDTO {
  id: number;
  date: string;
  heureD: string;
  salle: string;
  binome: BinomeDTO;
  role: string;
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
@Component({
  selector: 'app-planning-soutenances',
  templateUrl: './planning-soutenances.component.html',
  styleUrls: ['./planning-soutenances.component.css']
})
export class PlanningSoutenancesComponent implements OnInit {
  soutenances: SoutenanceWithRoleDTO[] = [];
  isLoading = false;
  errorMessage = '';
  currentUser: any;

  constructor(
    private enseignantService: EnseignantService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.loadSoutenances();
    }
  }

  loadSoutenances(): void {
    this.isLoading = true;
    this.enseignantService.getSoutenancesByEnseignant(this.currentUser.id).subscribe({
      next: (soutenances) => {
        this.soutenances = soutenances;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des soutenances';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getEtudiantNames(binome: BinomeDTO): string {
    return `${binome.etud1.prenom} ${binome.etud1.nom} & ${binome.etud2.prenom} ${binome.etud2.nom}`;
  }
}
