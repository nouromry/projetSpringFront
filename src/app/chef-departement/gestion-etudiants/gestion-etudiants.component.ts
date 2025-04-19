// gestion-etudiants.component.ts
import { Component, OnInit } from '@angular/core';
import { Etudiant } from 'src/app/models/etudiant.model';
import { Binome } from 'src/app/models/binome.model';
import { ChoixProjet } from 'src/app/models/choix-projet.model';
import { Projet } from 'src/app/models/projet.model';
import { BinomeService } from 'src/app/services/binome.service';
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

  // Import the service

  @Component({
    selector: 'app-gestion-etudiants',
    templateUrl: './gestion-etudiants.component.html',
    styleUrls: ['./gestion-etudiants.component.css']
  })
  export class GestionEtudiantsComponent implements OnInit {
  
    searchTerm: string = '';  // Terme de recherche
    filteredBinomes: BinomeDTO[] = [];  // Liste des binômes filtrés
  
    constructor(private binomeService: BinomeService) {}
  
    ngOnInit(): void {
      this.fetchBinomes();  // Récupérer les binômes au démarrage
    }
  
    // Récupérer les binômes via le service
    fetchBinomes(): void {
      this.binomeService.getBinomeDetails().subscribe(
        (data: BinomeDTO[]) => {
          console.log('Fetched binomes:', data); // Add this line
          this.filteredBinomes = data;  // Assign the fetched binomes to the filteredBinomes array
        },
        error => {
          console.error('Error fetching binomes:', error);
        }
      );
    }
    
  
    // Méthode pour filtrer les binômes selon le terme de recherche
    search(): void {
      if (this.searchTerm.trim()) {
        this.filteredBinomes = this.filteredBinomes.filter(binome =>
          binome.prenomEtud1.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          binome.nomEtud1.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          binome.prenomEtud2.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          binome.nomEtud2.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.fetchBinomes();  // Reset the binomes list if the search term is empty
      }
    }
    
    // Method to get the project choices for a binome
    getProjetChoices(binome: BinomeDTO): string {
      return binome.projetsChoisis.join(', ');  // Join project titles into a comma-separated string
    }
  }    