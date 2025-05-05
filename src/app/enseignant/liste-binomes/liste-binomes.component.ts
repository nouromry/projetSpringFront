import { Component, OnInit } from '@angular/core';
import { EnseignantService } from '../../services/enseignant-service.service';
import { AuthService } from '../../services/auth.service';

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

@Component({
  selector: 'app-liste-binomes',
  templateUrl: './liste-binomes.component.html',
  styleUrls: ['./liste-binomes.component.css']
})
export class ListeBinomesComponent implements OnInit {
  projets: ProjetWithBinomeDTO[] = [];
  filteredProjets: ProjetWithBinomeDTO[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  selectedFiliere = '';
  currentUser: any;

  // Extract unique filieres for filter dropdown
  get filieres(): string[] {
    return [...new Set(this.projets.map(p => p.filiere))];
  }

  constructor(
    private enseignantService: EnseignantService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    
    // Use the current user's ID instead of hardcoded value
    const enseignantId = this.currentUser?.id;
    
    if (!enseignantId) {
      this.errorMessage = 'User not authenticated or not an enseignant';
      this.isLoading = false;
      return;
    }
    
    this.enseignantService.getValidProjectsWithBinomeDetails(enseignantId).subscribe({
      next: (projets) => {
        this.projets = projets;
        this.filteredProjets = [...projets];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load projects';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  filterProjects(): void {
    this.filteredProjets = this.projets.filter(projet => {
      const matchesFiliere = this.selectedFiliere ? 
        projet.filiere.toLowerCase() === this.selectedFiliere.toLowerCase() : true;
      
      const matchesSearch = this.searchTerm ? 
        projet.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (projet.binomeAffecte?.etud1.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (projet.binomeAffecte?.etud1.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (projet.binomeAffecte?.etud2.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (projet.binomeAffecte?.etud2.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()))
        : true;
      
      return matchesFiliere && matchesSearch;
    });
  }

  onFiliereChange(filiere: string): void {
    this.selectedFiliere = filiere;
    this.filterProjects();
  }

  onSearchChange(): void {
    this.filterProjects();
  }
}