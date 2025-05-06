import { Component, OnInit } from '@angular/core';
import { BinomeService } from 'src/app/services/binome.service';
import { Projet } from 'src/app/models/projet.model';

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
  projetAffecte?: Projet; // Add this field for the assigned project
}

@Component({
  selector: 'app-gestion-etudiants',
  templateUrl: './gestion-etudiants.component.html',
  styleUrls: ['./gestion-etudiants.component.css']
})
export class GestionEtudiantsComponent implements OnInit {
  searchTerm: string = '';
  filteredBinomes: BinomeDTO[] = [];
  showProjectAssignments: boolean = false;
  isLoading: boolean = false;

  constructor(private binomeService: BinomeService) {}

  ngOnInit(): void {
    this.fetchBinomes();
  }

  fetchBinomes(): void {
    this.binomeService.getBinomeDetails().subscribe(
      (data: BinomeDTO[]) => {
        this.filteredBinomes = data;
      },
      error => {
        console.error('Error fetching binomes:', error);
      }
    );
  }

  toggleProjectAssignments(): void {
    this.showProjectAssignments = !this.showProjectAssignments;
    if (this.showProjectAssignments) {
      this.loadProjectAssignments();
    }
  }

  loadProjectAssignments(): void {
    this.isLoading = true;
    this.filteredBinomes.forEach(binome => {
      this.binomeService.getProjetByBinomeId(binome.id).subscribe(
        (projet: Projet) => {
          binome.projetAffecte = projet;
        },
        error => {
          console.error(`Error fetching project for binome ${binome.id}:`, error);
          binome.projetAffecte = undefined;
        },
        () => {
          this.isLoading = false;
        }
      );
    });
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.filteredBinomes = this.filteredBinomes.filter(binome =>
        binome.prenomEtud1.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        binome.nomEtud1.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        binome.prenomEtud2.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        binome.nomEtud2.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.fetchBinomes();
    }
  }

  getProjetChoices(binome: BinomeDTO): string {
    return binome.projetsChoisis.join(', ');
  }

  getAssignedProject(binome: BinomeDTO): string {
    return binome.projetAffecte ? binome.projetAffecte.titre : 'Non affecté';
  }
}